import * as NodeCache from "node-cache";
import {
  NetworkNode,
  NetworkEdge,
  Producer,
  Subscriber,
  VideoRequestResult,
  VideoRequestResultEdges,
  VideoRequest,
  ContentTrees,
} from "../model";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import util from "util";

const Cache = NodeCache.default;

export class Store {
  private networkNodeStore: NodeCache;
  private networkEdgeStore: NodeCache;
  private producerStore: NodeCache;
  private subscriberStore: NodeCache;
  private videoRequestStore: NodeCache;
  private videoRequestResultStore: NodeCache;
  private nodeSequence: number = 0;
  private edgeSequence: number = 0;
  private contentTrees: ContentTrees;
  private revenue: number;
  private duration: number;

  constructor() {
    this.networkNodeStore = new Cache();
    this.networkEdgeStore = new Cache();
    this.producerStore = new Cache();
    this.subscriberStore = new Cache();
    this.videoRequestStore = new Cache();
    this.videoRequestResultStore = new Cache();
  }

  addNetwordNode(): NetworkNode {
    this.nodeSequence++;
    const key = `node${this.nodeSequence}`;
    this.networkNodeStore.set<NetworkNode>(key, { id: key });
    return this.networkNodeStore.get(key);
  }

  addNetwordEdge(edge: Omit<NetworkEdge, "id">): NetworkEdge {
    this.edgeSequence++;
    const key = `edge${this.edgeSequence}`;
    this.networkEdgeStore.set<NetworkEdge>(key, { id: key, ...edge });
    return this.networkEdgeStore.get(key);
  }

  addProducer(producer: Producer): Producer {
    this.producerStore.set<Producer>(producer.id, { ...producer });
    return this.producerStore.get(producer.id);
  }

  addSubscriber(subscriber: Subscriber): Subscriber {
    this.subscriberStore.set<Subscriber>(subscriber.id, { ...subscriber });
    return this.subscriberStore.get(subscriber.id);
  }

  addVideoRequest(videoRequest: Omit<VideoRequest, "id">): VideoRequest {
    const key = uuidv4();
    this.videoRequestStore.set<VideoRequest>(key, { id: key, ...videoRequest });
    return this.videoRequestStore.get(key);
  }

  addVideoRequestResult(
    videoRequestResult: Omit<VideoRequestResult, "id">
  ): VideoRequestResult {
    const key = uuidv4();
    this.videoRequestResultStore.set<VideoRequestResult>(key, {
      id: key,
      ...videoRequestResult,
    });
    return this.videoRequestResultStore.get(key);
  }

  allNodes(): NetworkNode[] {
    return this.networkNodeStore.keys().map((key) => {
      return this.networkNodeStore.get(key);
    });
  }

  allEdges(): NetworkEdge[] {
    return this.networkEdgeStore.keys().map((key) => {
      return this.networkEdgeStore.get(key);
    });
  }

  allProducers(): Producer[] {
    return this.producerStore.keys().map((key) => {
      return this.producerStore.get(key);
    });
  }

  allSubscribers(): Subscriber[] {
    return this.subscriberStore.keys().map((key) => {
      return this.subscriberStore.get(key);
    });
  }

  allVideoRequests(): VideoRequest[] {
    return this.videoRequestStore.keys().map((key) => {
      return this.videoRequestStore.get(key);
    });
  }

  allVideoRequestsResults(): VideoRequestResult[] {
    return this.videoRequestResultStore.keys().map((key) => {
      return this.videoRequestResultStore.get(key);
    });
  }

  setContentTrees(contentTrees: ContentTrees) {
    this.contentTrees = contentTrees;
  }

  getContentTrees(): ContentTrees {
    return this.contentTrees;
  }

  setRevenue(value: number) {
    this.revenue = value;
  }

  getRevenue(): number {
    return this.revenue;
  }

  setDuration(value: number) {
    this.duration = value;
  }

  getDuration(): number {
    return this.duration;
  }

  async saveToFile(filename: string) {
    const fileWritePromise = util.promisify(fs.writeFile);
    const dto = {
      videoRequests: JSON.stringify(this.allVideoRequests()),
      revenue: this.revenue,
    };

    await fileWritePromise(filename, JSON.stringify(dto), {
      encoding: "utf8",
    });
  }
}
