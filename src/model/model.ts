import * as graphlib from 'graphlib';

export type EntityId = string;

export interface NetworkNode {
    id: EntityId;
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
    id: EntityId,
    edges: EntityId[]
}

export interface Producer {
    id: EntityId;
    node: EntityId;
    base_layer_bw: number;
    enhancement_layer_1_bw: number;
    enhancement_layer_2_bw: number;
}

export type SUBSCRIBER_PRIORITY = 'GOLD' | 'SILVER' | 'BRONZE';

export interface Subscriber {
    id: EntityId;
    node: EntityId;
    priority: SUBSCRIBER_PRIORITY;
}

export type LAYER = 'BASE' | 'EL1' | 'EL2';

export interface VideoRequest {
    id: EntityId;
    subscriber: EntityId;
    producer: EntityId;
    layer: LAYER;
}

export enum VIDEO_REQUEST_STATUS {
    PENDING = "PENDING",
    INVALID = "INVALID",
    SERVED = "SERVED"
}

export enum ALGORITHM {
    LBS = "LBS",
    LLVS = "LLVS"
}

export interface VideoRequestResult {
    id: EntityId;
    alogorithm: ALGORITHM; 
    videoRequest: EntityId;
    status: VIDEO_REQUEST_STATUS;    
    e2e_latency: number;
    e2e_jitter: number;
    e2e_hopCount: number;
}

export interface VideoRequestResultEdges {
    id: EntityId;    
    videoRequestResult: EntityId;
    edge: EntityId; 
}

export interface AlgorithmInput {
    graph: graphlib.Graph;
    subscribers: Subscriber[];
    producers: Producer[];
    requests: VideoRequest[];
}

export interface AlgorithmOutput {
    videoRequestResult: VideoRequestResult[];
    videoRequestResultEdges: VideoRequestResultEdges[];    
}

export interface Content {
    producer: EntityId;
    layer: LAYER;
}