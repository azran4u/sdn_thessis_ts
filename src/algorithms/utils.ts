import {
  Producer,
  LAYER,
  NetworkEdge,
  NetworkPath,
  VideoRequest,
  ContentTreeNetworkNode,
  NetworkNode,
  AvailablePath,
} from "../model";
import * as graphlib from "graphlib";
import { config } from "../config";
import _ from "lodash";

export class GraphUtil {
  static getProducerBwByLayer(producer: Producer, layer: LAYER): number {
    let bw;
    switch (layer) {
      case "BASE": {
        bw = producer.base_layer_bw;
        break;
      }
      case "EL1": {
        bw = producer.enhancement_layer_1_bw;
        break;
      }
      case "EL2": {
        bw = producer.enhancement_layer_2_bw;
        break;
      }
    }
    return bw;
  }

  static contentToKey(producerId: string, layer: LAYER) {
    return JSON.stringify({
      producer: producerId,
      layer: layer,
    });
  }

  static dijkstra(G: graphlib.Graph, src: string, dst: string): NetworkPath {
    const paths = graphlib.alg.dijkstra(G, src, (e) => {
      const edge = (G.edge(e) as any) as NetworkEdge;
      return edge.latency;
    });
    const latency = +paths[dst].distance;
    if (latency >= Number.MAX_SAFE_INTEGER) {
      return {
        edges: [],
        latency: Number.MAX_SAFE_INTEGER,
        hopCount: 0,
        jitter: Number.MAX_SAFE_INTEGER,
        availableBw: 0,
      };
    }
    let jitter = 0;
    const path: NetworkEdge[] = [];
    let node = dst;
    let availableBw = Number.MAX_SAFE_INTEGER;
    while (!!paths[node].predecessor) {
      const edge = (G.edge(
        paths[node].predecessor,
        node
      ) as any) as NetworkEdge;
      path.push(edge);
      jitter += edge.jitter;
      node = paths[node].predecessor;
      if (edge.bw < availableBw) {
        availableBw = edge.bw;
      }
    }
    return {
      edges: path,
      latency: latency,
      jitter: jitter,
      hopCount: path.length,
      availableBw: availableBw,
    };
  }

  // find all requests with the same producer and subscriber with hiegher layer
  static findHigherLayerRequests(
    requests: VideoRequest[],
    request: VideoRequest
  ): VideoRequest[] {
    return requests.filter((req) => {
      // same producer and subscriber
      if (
        req.producer === request.producer &&
        req.subscriber === request.subscriber
      ) {
        // same layer
        if (req.layer === request.layer) {
          return false;
        }
        // if BASE - remove EL1 and EL2
        if (request.layer === "BASE") {
          if (req.layer === "EL1" || req.layer === "EL2") {
            return true;
          }
        }
        // if EL1 - remove EL2
        if (request.layer === "EL1") {
          if (req.layer === "EL2") {
            return true;
          }
        }
      }
      return false;
    });
  }

  static isValidPath(path: NetworkPath): boolean {
    if (!path) return false;
    return (
      path.latency < config.subscriber.max_latency &&
      path.jitter < config.subscriber.max_jitter
    );
  }

  static selectBestPath(paths: AvailablePath[]): AvailablePath {
    if (paths.length === 0) throw new Error("invalid input to selectBestPath");
    const minLatency = _.minBy(paths, (path) => {
      return path.e2e_path.latency;
    }).e2e_path.latency;
    const lowestLatencyPaths = paths.filter((path) => {
      return path.e2e_path.latency === minLatency;
    });
    const minJitter = _.minBy(lowestLatencyPaths, (path) => {
      return path.e2e_path.jitter;
    }).e2e_path.jitter;
    const lowestJitterPaths = lowestLatencyPaths.filter((path) => {
      return path.e2e_path.jitter === minJitter;
    });
    const minHopCount = _.minBy(lowestJitterPaths, (path) => {
      return path.e2e_path.edges.length;
    }).e2e_path.edges.length;
    const lowestHopCountPaths = lowestJitterPaths.filter((path) => {
      return path.e2e_path.edges.length === minHopCount;
    });
    return lowestHopCountPaths[0];
  }

  static removeEdgesWithoutEnoughBw(
    G: graphlib.Graph,
    minBw: number
  ): graphlib.Graph {
    const H = _.cloneDeep(G);
    _.forEach(H.edges(), (e) => {
      const edge = (H.edge(e) as any) as NetworkEdge;
      if (edge.bw < minBw) {
        H.setEdge(edge.from_node, edge.to_node, {
          ...edge,
          latency: Number.MAX_SAFE_INTEGER,
        } as NetworkEdge);
        // H.removeEdge(e);
      }
    });
    return H;
  }

  //  substract every edge's bw in G where the edge is part of path
  static updatePathBwInGraph(
    path: NetworkPath,
    bw: number,
    G: graphlib.Graph
  ): graphlib.Graph {
    path.edges.forEach((edge) => {
      // update G with the served bandwidth
      const edgeBefore = G.edge(edge.from_node, edge.to_node) as NetworkEdge;
      G.setEdge(edge.from_node, edge.to_node, {
        ...edgeBefore,
        bw: edgeBefore.bw - bw,
      });
    });
    return G;
  }

  static addPathToTree(
    pathToGraph: AvailablePath,
    G: graphlib.Graph
  ): graphlib.Graph {
    let currentNode = pathToGraph.v;
    const edges = pathToGraph.pathToV.edges;
    while (edges.length > 0) {
      const currentEdgeIndex = edges.findIndex((edge) => {
        return edge.from_node === currentNode.id;
      });
      if (currentEdgeIndex === -1) {
        // not found
        throw new Error(`addPathToTree error`);
      }
      const currentEdge = edges[currentEdgeIndex];
      const fromNode: ContentTreeNetworkNode = G.node(currentEdge.from_node);
      const toNode: NetworkNode = { id: currentEdge.to_node };
      G.setNode(currentEdge.to_node, {
        ...toNode,
        e2e_hopCount: fromNode.e2e_hopCount + 1,
        e2e_latency: fromNode.e2e_latency + currentEdge.latency,
        e2e_jitter: fromNode.e2e_jitter + currentEdge.jitter,
      } as ContentTreeNetworkNode);
      G.setEdge(currentEdge.from_node, currentEdge.to_node, currentEdge);
      edges.splice(currentEdgeIndex, 1);
      currentNode = toNode;
    }
    return G;
  }

  static initContentTress(
    graph: graphlib.Graph,
    requests: VideoRequest[],
    producers: Producer[]
  ): Map<string, graphlib.Graph> {
    const contentTrees = new Map<string, graphlib.Graph>();
    for (const request of requests) {
      const g = new graphlib.Graph({
        directed: true,
        multigraph: false, // tree isn't multigraph
        compound: false,
      });

      // add the node the producer is connected to
      const producer = producers.find((x) => x.id === request.producer);
      const node = producer.node;
      // g.setNode(node, input.graph.node(node));
      g.setNode(node, {
        id: graph.node(node),
        e2e_hopCount: 1,
        e2e_latency: 0,
        e2e_jitter: 0,
      } as ContentTreeNetworkNode);
      contentTrees.set(
        GraphUtil.contentToKey(request.producer, request.layer),
        g
      );
    }
    return contentTrees;
  }

  static joinPaths(a: NetworkPath, b: NetworkPath): NetworkPath {
    const c: NetworkPath = b;
    if (a.edges.length === 0) return b;
    if (b.edges.length === 0) return a;

    c.edges = [...a.edges, ...b.edges];
    c.availableBw = Math.min(a.availableBw, b.availableBw);
    c.hopCount = a.hopCount + b.hopCount;
    c.latency = a.latency + b.latency;
    c.jitter = a.jitter + b.jitter;
    return c;
  }

  static isOdd(num): boolean {
    return num % 2 === 1;
  }
}
