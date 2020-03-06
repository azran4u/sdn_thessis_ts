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
