import _ from "lodash";
import {
  Algorithm,
  AlgorithmOutput,
  VIDEO_REQUEST_STATUS,
  NetworkGraph,
  VideoRequestResultInput,
  VideoRequest,
  AlgorithmOptions,
  NetworkPath,
  ALGORITHM,
  Subscriber,
  Producer,
} from "../model";
import { GraphUtil } from "./utils";
import { duration } from "../utils/duration";

interface LLVSOptions extends AlgorithmOptions {
  input: NetworkGraph;
}
// starts from empty network and assigns requests by revenue
// may stop serving currently served requests
export class LLVS extends Algorithm {
  private input: NetworkGraph;
  constructor(options: LLVSOptions) {
    super({ max_delay: options.max_delay, max_jitter: options.max_jitter });
    this.input = options.input;
  }
  run(): AlgorithmOutput {
    const videoRequestResults: VideoRequestResultInput[] = [];

    // init content trees
    const contentTrees = GraphUtil.initContentTress(
      this.input.graph,
      this.input.requests,
      this.input.producers
    );

    const startTime = process.hrtime();

    let sortedRequests = this.sortRequestsByExpectedRevenue();

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

      // remove edges that don't meet the bandwidth requiremnt
      const producer = this.input.producers.find(
        (x) => x.id === request.producer
      );
      const subscriber = this.input.subscribers.find(
        (x) => x.id === request.subscriber
      );
      const requestBw = GraphUtil.getProducerBwByLayer(producer, request.layer);

      const H = GraphUtil.removeEdgesWithoutEnoughBw(
        this.input.graph,
        requestBw
      );

      // find shortest path from producer to subscriber
      const path = GraphUtil.dijkstra(H, producer.node, subscriber.node);

      if (this.isValidPath(path, request, videoRequestResults)) {
        // update G
        this.input.graph = GraphUtil.updatePathBwInGraph(
          path,
          requestBw,
          this.input.graph
        );

        // get all nodes that are part of (producer,layer)
        let tree = contentTrees.get(
          GraphUtil.contentToKey(request.producer, request.layer)
        );

        // update content tree
        tree = GraphUtil.mergePathIntoTree(path.edges, tree);
        contentTrees.set(
          GraphUtil.contentToKey(request.producer, request.layer),
          tree
        );

        // update video request results
        videoRequestResults.push({
          alogorithm: ALGORITHM.LLVS,
          videoRequestId: request.id,
          status: VIDEO_REQUEST_STATUS.SERVED,
          e2e_path: path,
        });
      } else {
        // update video request results
        videoRequestResults.push({
          alogorithm: ALGORITHM.LLVS,
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
            alogorithm: ALGORITHM.LLVS,
            videoRequestId: req.id,
            status: VIDEO_REQUEST_STATUS.REJECTED,
            e2e_path: null,
          });
        });
      }
    }

    return {
      videoRequestResult: videoRequestResults,
      contentTrees: contentTrees,
      revenue: this.revenue(
        videoRequestResults,
        this.input.requests,
        this.input.subscribers,
        this.input.producers
      ),
      duration: duration(startTime),
    };
  }

  private isValidPath(
    path: NetworkPath,
    request: VideoRequest,
    videoRequestResults: VideoRequestResultInput[]
  ): boolean {
    if (path.edges.length === 0) return false;
    // check latency contraint
    if (path.latency > this.options.max_delay) return false;

    // check jitter constraint
    if (request.layer != "BASE") {
      const baseLayerRequest = this.input.requests.find((req) => {
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
        Math.abs(path.latency - baseLayerRequestResult.e2e_path.latency) >
        this.options.max_jitter
      ) {
        return false;
      }
    }

    return true;
  }

  private sortRequestsByExpectedRevenue(): VideoRequest[] {
    const gold_bl: VideoRequest[] = [];
    const silver_bl: VideoRequest[] = [];
    const gold_el1: VideoRequest[] = [];
    const bronze_bl: VideoRequest[] = [];
    const silver_el1: VideoRequest[] = [];
    const gold_el2: VideoRequest[] = [];
    const bronze_el1: VideoRequest[] = [];
    const silver_el2: VideoRequest[] = [];
    const bronze_el2: VideoRequest[] = [];
    // sort by revenue table
    this.input.requests.forEach((request) => {
      const subscriber = this.input.subscribers.find(
        (subscriber) => subscriber.id === request.subscriber
      );
      if (subscriber.priority === "GOLD" && request.layer === "BASE") {
        gold_bl.push(request);
      } else if (subscriber.priority === "SILVER" && request.layer === "BASE") {
        silver_bl.push(request);
      } else if (subscriber.priority === "GOLD" && request.layer === "EL1") {
        gold_el1.push(request);
      } else if (subscriber.priority === "BRONZE" && request.layer === "BASE") {
        bronze_bl.push(request);
      } else if (subscriber.priority === "SILVER" && request.layer === "EL1") {
        silver_el1.push(request);
      } else if (subscriber.priority === "GOLD" && request.layer === "EL2") {
        gold_el2.push(request);
      } else if (subscriber.priority === "BRONZE" && request.layer === "EL1") {
        bronze_el1.push(request);
      } else if (subscriber.priority === "SILVER" && request.layer === "EL2") {
        silver_el2.push(request);
      } else if (subscriber.priority === "BRONZE" && request.layer === "EL2") {
        bronze_el2.push(request);
      }
    });
    return [
      ...gold_bl,
      ...silver_bl,
      ...gold_el1,
      ...bronze_bl,
      ...silver_el1,
      ...gold_el2,
      ...bronze_el1,
      ...silver_el2,
      ...bronze_el2,
    ];
  }

  private revenue(
    videoRequestResults: VideoRequestResultInput[],
    requests: VideoRequest[],
    subscribers: Subscriber[],
    producers: Producer[]
  ): number {
    const w1 = 8;
    const w2 = 1;
    const w3 = 0;
    const w4 = 0;
    const w5 = 0;
    const w6 = 0;
    const w7 = 0;
    const w8 = 0;
    const w9 = 0;
    return videoRequestResults.reduce((totalRevenue, result) => {
      const request = requests.find((req) => {
        return req.id === result.videoRequestId;
      });
      const subscriber = subscribers.find((subscriber) => {
        return subscriber.id === request.subscriber;
      });
      const producer = producers.find((producer) => {
        return producer.id === request.producer;
      });
      if (result.status === VIDEO_REQUEST_STATUS.SERVED) {
        if (request.layer === "BASE" && subscriber.priority === "GOLD") {
          return totalRevenue + producer.base_layer_bw * w1;
        } else if (
          request.layer === "BASE" &&
          subscriber.priority === "SILVER"
        ) {
          return totalRevenue + producer.base_layer_bw * w2;
        } else if (request.layer === "EL1" && subscriber.priority === "GOLD") {
          return totalRevenue + producer.enhancement_layer_1_bw * w3;
        } else if (
          request.layer === "BASE" &&
          subscriber.priority === "BRONZE"
        ) {
          return totalRevenue + producer.base_layer_bw * w4;
        } else if (
          request.layer === "EL1" &&
          subscriber.priority === "SILVER"
        ) {
          return totalRevenue + producer.enhancement_layer_1_bw * w5;
        } else if (request.layer === "EL2" && subscriber.priority === "GOLD") {
          return totalRevenue + producer.enhancement_layer_2_bw * w6;
        } else if (
          request.layer === "EL1" &&
          subscriber.priority === "BRONZE"
        ) {
          return totalRevenue + producer.enhancement_layer_1_bw * w7;
        } else if (
          request.layer === "EL2" &&
          subscriber.priority === "SILVER"
        ) {
          return totalRevenue + producer.enhancement_layer_2_bw * w8;
        } else if (
          request.layer === "EL2" &&
          subscriber.priority === "BRONZE"
        ) {
          return totalRevenue + producer.enhancement_layer_2_bw * w9;
        }
      } else {
        return totalRevenue;
      }
    }, 0);
  }
}
