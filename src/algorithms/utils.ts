import {
  Producer,
  LAYER,
  NetworkEdge,
  NetworkPath,
  EntityId,
  VideoRequest,
  ContentTreeNetworkNode,
  NetworkNode,
  PathToTree,
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
    let jitter = 0;
    const path: NetworkEdge[] = [];
    let node = dst;
    while (!!paths[node].predecessor) {
      const edge = (G.edge(
        paths[node].predecessor,
        node
      ) as any) as NetworkEdge;
      path.push(edge);
      jitter += edge.jitter;
      node = paths[node].predecessor;
    }
    return {
      edges: path,
      latency: latency,
      jitter: jitter,
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

  static selectBestPath(paths: PathToTree[]): PathToTree {
    if (paths.length === 0) throw new Error("invalid input to selectBestPath");
    const minLatency = _.minBy(paths, (path) => {
      return path.path.latency;
    }).path.latency;
    const lowestLatencyPaths = paths.filter((path) => {
      return path.path.latency === minLatency;
    });
    const minJitter = _.minBy(lowestLatencyPaths, (path) => {
      return path.path.jitter;
    }).path.jitter;
    const lowestJitterPaths = lowestLatencyPaths.filter((path) => {
      return path.path.jitter === minJitter;
    });
    const minHopCount = _.minBy(lowestJitterPaths, (path) => {
      return path.path.edges.length;
    }).path.edges.length;
    const lowestHopCountPaths = lowestJitterPaths.filter((path) => {
      return path.path.edges.length === minHopCount;
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
        H.removeEdge(e);
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
    pathToGraph: PathToTree,
    G: graphlib.Graph
  ): graphlib.Graph {
    let currentNode = pathToGraph.node;
    const edges = pathToGraph.path.edges;
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
}
