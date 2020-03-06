export interface NetworkNode {
    id: number;
    text: string;
}

export interface NetworkEdge {
    id: string;
    from_node: number;
    to_node: number;
    bw: number;
    latency: number;
    jitter: number;
}

export interface Producer {
    id: string;
    node: number;
    base_layer_bw: number;
    enhancement_layer_1_bw: number;
    enhancement_layer_2_bw: number;
}