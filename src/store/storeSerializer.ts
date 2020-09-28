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
import fs from "fs";
import util from "util";
import { Store } from ".";
import * as graphlib from "graphlib";

const Cache = NodeCache.default;

interface StoreDTO {
  networkNodeStore: NetworkNode[];
  networkEdgeStore: NetworkEdge[];
  producerStore: Producer[];
  subscriberStore: Subscriber[];
  videoRequestStore: VideoRequest[];
  videoRequestResultStore: VideoRequestResult[];
  contentTrees: Array<{ key: string; graph: Object }>;
  revenue: number;
}
export class StoreSerializer {
  static serialize(store: Store): StoreDTO {
    return {
      networkNodeStore: store.allNodes(),
      networkEdgeStore: store.allEdges(),
      producerStore: store.allProducers(),
      subscriberStore: store.allSubscribers(),
      videoRequestStore: store.allVideoRequests(),
      videoRequestResultStore: store.allVideoRequestsResults(),
      contentTrees: StoreSerializer.mapToDto(store.getContentTrees()),
      revenue: store.getRevenue(),
    };
  }

  static deserialize(dto: StoreDTO): Store {
    return new Store();
  }

  static async saveToFile(store: Store, filename: string) {
    const fileWritePromise = util.promisify(fs.writeFile);
    await fileWritePromise(filename, JSON.stringify(this.serialize(store)), {
      encoding: "utf8",
    });
  }

  private static mapToDto(
    contentTrees: ContentTrees
  ): Array<{ key: string; graph: Object }> {
    const res: Array<{ key: string; graph: Object }> = [];
    contentTrees.forEach((graph, key) => {
      res.push({
        key: key,
        graph: graphlib.json.write(graph),
      });
    });
    return res;
  }
}
