import _ from "lodash";
import {
  Algorithm,
  AlgorithmOutput,
  VIDEO_REQUEST_STATUS,
  NetworkGraph,
  VideoRequestResultInput,
  AvailablePath,
  ALGORITHM,
  VideoRequest,
  AlgorithmOptions,
} from "../model";
import { duration } from "../utils/duration";
import { GraphUtil } from "./utils";

export class LBS extends Algorithm {
  constructor(options: AlgorithmOptions) {
    super(options);
  }
  run(input: NetworkGraph): AlgorithmOutput {
    const videoRequestResults: VideoRequestResultInput[] = [];
    // create content tress
    const contentTrees = GraphUtil.initContentTress(
      input.graph,
      input.requests,
      input.producers
    );

    const startTime = process.hrtime();
    // sort requests by layer
    let sortedRequests = _.orderBy(input.requests, ["layer"], ["asc"]);

    for (const request of sortedRequests) {
      const result = videoRequestResults.find(
        (x) => x.videoRequestId === request.id
      );

      if (
        (result && result.status === VIDEO_REQUEST_STATUS.SERVED) ||
        (result && result.status === VIDEO_REQUEST_STATUS.REJECTED)
      ) {
        continue;
      }

      // P holds all possible paths
      const P: AvailablePath[] = [];

      // remove edges that don't meet the bandwidth requiremnt
      const producer = input.producers.find((x) => x.id === request.producer);
      const subscriber = input.subscribers.find(
        (x) => x.id === request.subscriber
      );
      const requestBw = GraphUtil.getProducerBwByLayer(producer, request.layer);

      const H = GraphUtil.removeEdgesWithoutEnoughBw(input.graph, requestBw);

      // get all nodes that are part of (producer,layer)
      let tree = contentTrees.get(
        GraphUtil.contentToKey(request.producer, request.layer)
      );
      const scki = tree.nodes();

      for (const v of scki) {
        // find shortest latency path in H
        const pathToV = GraphUtil.dijkstra(H, v, subscriber.node);

        if (pathToV.edges.length === 0) continue;

        const pathFromVToProducer = GraphUtil.dijkstra(tree, producer.node, v);
        const e2e_path = GraphUtil.joinPaths(pathToV, pathFromVToProducer);

        // check latency constraint
        if (e2e_path.latency > this.options.max_delay) continue;

        // check jitter constraint
        if (request.layer != "BASE") {
          const baseLayerRequest = input.requests.find((req) => {
            return (
              req.producer === request.producer &&
              req.subscriber === request.subscriber &&
              req.layer === "BASE"
            );
          });
          const baseLayerRequestResult = videoRequestResults.find((res) => {
            return res.videoRequestId === baseLayerRequest.id;
          });
          if (
            Math.abs(
              e2e_path.latency - baseLayerRequestResult.e2e_path.latency
            ) > this.options.max_jitter
          ) {
            continue;
          }
        }

        //  path is vaild
        P.push({
          e2e_path: e2e_path,
          pathFromVToProducer: pathFromVToProducer,
          pathToV: pathToV,
          v: H.node(v),
        });
      }
      // no paths found for this request
      if (P.length === 0) {
        // set video request result to REJECTED
        videoRequestResults.push({
          alogorithm: ALGORITHM.LBS,
          videoRequestId: request.id,
          status: VIDEO_REQUEST_STATUS.REJECTED,
          e2e_path: null,
        });

        // set upper layer requests INVALID
        const higherLayerRequests = GraphUtil.findHigherLayerRequests(
          sortedRequests,
          request
        );
        higherLayerRequests.forEach((req) => {
          videoRequestResults.push({
            alogorithm: ALGORITHM.LBS,
            videoRequestId: req.id,
            status: VIDEO_REQUEST_STATUS.REJECTED,
            e2e_path: null,
          });
        });
      } else {
        // find best path
        const bestPath = this.selectBestPath(P);

        // update G
        input.graph = GraphUtil.updatePathBwInGraph(
          bestPath.pathToV,
          requestBw,
          input.graph
        );

        // update content tree
        tree = GraphUtil.mergePathIntoTree(bestPath.e2e_path.edges, tree);
        contentTrees.set(
          GraphUtil.contentToKey(request.producer, request.layer),
          tree
        );

        // update video request results
        videoRequestResults.push({
          alogorithm: ALGORITHM.LBS,
          videoRequestId: request.id,
          status: VIDEO_REQUEST_STATUS.SERVED,
          e2e_path: bestPath.e2e_path,
        });
      }
    }

    return {
      videoRequestResult: videoRequestResults,
      contentTrees: contentTrees,
      revenue: this.revenue(videoRequestResults, input.requests),
      duration: duration(startTime),
    };
  }

  private selectBestPath(paths: AvailablePath[]): AvailablePath {
    if (paths.length === 0) throw new Error("invalid input to selectBestPath");

    if (paths.length === 1) return paths[0];

    // select path with minimum latency
    const minLatency = _.minBy(paths, (path) => {
      return path.e2e_path.latency;
    }).e2e_path.latency;
    const lowestLatencyPaths = paths.filter((path) => {
      return path.e2e_path.latency === minLatency;
    });

    if (lowestLatencyPaths.length === 1) return lowestLatencyPaths[0];

    // select path with max avialable bw
    const maxAvialableBw = _.maxBy(lowestLatencyPaths, (path) => {
      return path.e2e_path.availableBw;
    }).e2e_path.availableBw;
    const maxAvialableBwPaths = lowestLatencyPaths.filter((path) => {
      return path.e2e_path.availableBw === maxAvialableBw;
    });
    if (maxAvialableBwPaths.length === 1) return maxAvialableBwPaths[0];

    // select random path
    return maxAvialableBwPaths[0];
  }

  private revenue(
    videoRequestResults: VideoRequestResultInput[],
    requests: VideoRequest[]
  ): number {
    const [w1, w2, w3] = this.options.w;
    const sum = w1 + w2 + w3;
    return videoRequestResults.reduce((totalRevenue, result) => {
      const request = requests.find((req) => {
        return req.id === result.videoRequestId;
      });
      if (result.status === VIDEO_REQUEST_STATUS.SERVED) {
        if (request.layer === "BASE") {
          return totalRevenue + w1 / sum;
        } else if (request.layer === "EL1") {
          return totalRevenue + w2 / sum;
        } else if (request.layer === "EL2") {
          return totalRevenue + w3 / sum;
        }
      } else {
        return totalRevenue;
      }
    }, 0);
  }
}
