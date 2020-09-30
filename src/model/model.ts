import * as graphlib from "graphlib";
import { NumericDictionary } from "lodash";
import { Store } from "../store";

export type EntityId = string;

export interface NetworkNode {
  id: EntityId;
}

export interface ContentTreeNetworkNode extends NetworkNode {
  e2e_hopCount: number;
  e2e_latency: number;
  e2e_jitter: number;
}
export interface NetworkEdge {
  id: EntityId;
  from_node: EntityId;
  to_node: EntityId;
  bw: number;
  latency: number;
  jitter: number;
}

export interface NetworkPath {
  edges: NetworkEdge[];
  latency: number;
  jitter: number;
  hopCount: number;
  availableBw: number;
}

export interface Producer {
  id: EntityId;
  node: EntityId;
  base_layer_bw: number;
  enhancement_layer_1_bw: number;
  enhancement_layer_2_bw: number;
}

export type SUBSCRIBER_PRIORITY = "GOLD" | "SILVER" | "BRONZE";

export interface Subscriber {
  id: EntityId;
  node: EntityId;
  priority: SUBSCRIBER_PRIORITY;
}

export type LAYER = "BASE" | "EL1" | "EL2";

export interface VideoRequest {
  id: EntityId;
  subscriber: EntityId;
  producer: EntityId;
  layer: LAYER;
}

export enum VIDEO_REQUEST_STATUS {
  REJECTED = "REJECTED",
  SERVED = "SERVED",
  NOT_SERVED = "NOT_SERVED",
}

export enum ALGORITHM {
  LBS = "LBS",
  LLVS = "LLVS",
}

export type VideoRequestResultInput = Omit<VideoRequestResult, "id">;
export interface VideoRequestResult {
  id: EntityId;
  alogorithm: ALGORITHM;
  videoRequestId: EntityId;
  status: VIDEO_REQUEST_STATUS;
  e2e_path: NetworkPath;
}

export interface VideoRequestResultEdges {
  id: EntityId;
  videoRequestResult: EntityId;
  edge: EntityId;
}

export interface NetworkGraph {
  graph: graphlib.Graph;
  subscribers: Subscriber[];
  producers: Producer[];
  requests: VideoRequest[];
}

export type ContentTrees = Map<string, graphlib.Graph>;
export interface AlgorithmOutput {
  videoRequestResult: VideoRequestResultInput[];
  contentTrees: ContentTrees;
  revenue: number;
  duration: number;
}

export interface Content {
  producer: EntityId;
  layer: LAYER;
}

export abstract class NetworkGenerator {
  constructor(protected store: Store) {}
  abstract generate(): NetworkGraph;
}

export interface AlgorithmOptions {
  max_delay: number;
  max_jitter: number;
}

export abstract class Algorithm {
  constructor(protected options: AlgorithmOptions) {}
  abstract run(input: NetworkGraph): AlgorithmOutput;
}

export interface Scenario {
  start();
}

export interface AvailablePath {
  pathToV: NetworkPath;
  v: NetworkNode;
  pathFromVToProducer: NetworkPath;
  e2e_path: NetworkPath;
}
