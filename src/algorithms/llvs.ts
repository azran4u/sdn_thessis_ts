import _ from "lodash";
import * as graphlib from "graphlib";
import {
  Algorithm,
  AlgorithmOutput,
  VIDEO_REQUEST_STATUS,
  NetworkGraph,
  ContentTreeNetworkNode,
  VideoRequestResultInput,
  NetworkNode,
  VideoRequest,
} from "../model";
import { GraphUtil } from "./utils";

// starts from empty network and assigns requests by revenue
// may stop serving currently served requests
export class LLVS implements Algorithm {
  constructor(private input: NetworkGraph) {}
  run(): AlgorithmOutput {
    const contentTrees = new Map<string, graphlib.Graph>();

    const videoRequestResults: VideoRequestResultInput[] = [];

    // init the map with empty graph for each content
    for (const request of this.input.requests) {
      const g = new graphlib.Graph({
        directed: true,
        multigraph: false, // tree isn't multigraph
        compound: false,
      });

      // add the node the producer is connected to
      const producer = this.input.producers.find(
        (x) => x.id === request.producer
      );
      const node = producer.node;
      // g.setNode(node, input.graph.node(node));
      g.setNode(node, {
        id: this.input.graph.node(node),
        e2e_hopCount: 1,
        e2e_latency: 0,
        e2e_jitter: 0,
      } as ContentTreeNetworkNode);
      contentTrees.set(
        GraphUtil.contentToKey(request.producer, request.layer),
        g
      );
    }

    let sortedRequests = this.sortRequestsByExpectedRevenue();

    for (const request of sortedRequests) {
      const result = videoRequestResults.find(
        (x) => x.videoRequestId === request.id
      );

      if (result && result.status === VIDEO_REQUEST_STATUS.REJECTED) {
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

      const path = GraphUtil.dijkstra(H, producer.node, subscriber.node);
      if (path && GraphUtil.isValidPath(path)) {
        // path exists and valid
      } else {
      }
    }
    return {
      videoRequestResult: videoRequestResults,
      contentTrees: contentTrees,
      revenue: this.revenue(),
    };
  }

  private setRequestAsRejected(request: VideoRequest) {}
  private sortRequestsByExpectedRevenue(): VideoRequest[] {
    const gold_bl: VideoRequest[] = [];
    const silver_bl: VideoRequest[] = [];
    const gold_el: VideoRequest[] = [];
    const bronze_bl: VideoRequest[] = [];
    const silver_el: VideoRequest[] = [];
    const bronze_el: VideoRequest[] = [];
    // sort by revenue table
    this.input.requests.forEach((request) => {
      const subscriber = this.input.subscribers.find(
        (subscriber) => subscriber.id === request.subscriber
      );
      if (subscriber.priority === "GOLD" && request.layer === "BASE") {
        gold_bl.push(request);
      } else if (subscriber.priority === "SILVER" && request.layer === "BASE") {
        silver_bl.push(request);
      } else if (
        subscriber.priority === "GOLD" &&
        (request.layer === "EL1" || request.layer === "EL2")
      ) {
        gold_el.push(request);
      } else if (subscriber.priority === "BRONZE" && request.layer === "BASE") {
        bronze_bl.push(request);
      } else if (
        subscriber.priority === "SILVER" &&
        (request.layer === "EL1" || request.layer === "EL2")
      ) {
        silver_el.push(request);
      } else if (
        subscriber.priority === "BRONZE" &&
        (request.layer === "EL1" || request.layer === "EL2")
      ) {
        bronze_el.push(request);
      }
    });
    return [
      ...gold_bl,
      ...silver_bl,
      ...gold_el,
      ...bronze_bl,
      ...silver_el,
      ...bronze_el,
    ];
  }

  private revenue() {
    return 0;
  }
}
