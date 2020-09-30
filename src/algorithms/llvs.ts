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

      const path = GraphUtil.dijkstra(H, producer.node, subscriber.node);
      if (this.isValidPath(path)) {
        // path exists and valid
      } else {
      }
    }

    return {
      videoRequestResult: videoRequestResults,
      contentTrees: contentTrees,
      revenue: this.revenue(),
      duration: duration(startTime),
    };
  }

  private isValidPath(path: NetworkPath): boolean {
    return true;
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
