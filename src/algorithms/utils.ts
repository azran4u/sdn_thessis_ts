import { Producer, LAYER, NetworkEdge, NetworkPath, EntityId, VideoRequest, ContentTreeNetworkNode, NetworkNode } from "../model";
import * as graphlib from 'graphlib';
import { config } from '../config';

export function getProducerBwByLayer(producer: Producer, layer: LAYER): number {
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

export function contentToKey(producerId: string, layer: LAYER) {
    return JSON.stringify({
        producer: producerId,
        layer: layer
    })
}

export function dijkstra(G: graphlib.Graph, src: string, dst: string): NetworkPath {
    const paths = graphlib.alg.dijkstra(G, src, (e) => {
        const edge = G.edge(e) as any as NetworkEdge;
        return edge.latency;
    });
    const latency = +paths[dst].distance;
    let jitter = 0;
    const path: NetworkEdge[] = [];
    let node = dst;
    while (!!paths[node].predecessor) {
        const edge = G.edge(paths[node].predecessor, node) as any as NetworkEdge;
        path.push(edge);
        jitter += edge.jitter;
        node = paths[node].predecessor;
    }
    return {
        edges: path,
        latency: latency,
        jitter: jitter
    }
}

// remove the given request and remove every request with the same producer and subscriber with hiegher layer
export function removeVideoRequestsWithHigherLayer(requests: VideoRequest[], request: VideoRequest): VideoRequest[] {
    return requests.filter(req => {
        // same producer and subscriber
        if (req.producer === request.producer && req.subscriber === request.subscriber) {
            // same layer
            if (req.layer === request.layer) {
                return false;
            }
            // if BASE - remove EL1 and EL2
            if (request.layer === 'BASE') {
                if (req.layer === 'EL1' || req.layer === 'EL2') {
                    return false;
                }
            }
            // if EL1 - remove EL2
            if (request.layer === 'EL1') {
                if (req.layer === 'EL2') {
                    return false;
                }
            }
        }
        return true;
    })
}

export function addPathToGraph(path: NetworkPath, node: NetworkNode, dst: graphlib.Graph): graphlib.Graph {
    path.edges.forEach(edge => {
        const node = src.node(edge.from_node) as NetworkNode;
        dst.setNode(node.id, { id: node.id, e2e } as ContentTreeNetworkNode)

    })
    return G;
}

export function isValidPath(path: NetworkPath): boolean {
    return (path.latency < config.subscriber.max_latency) &&
        (path.jitter < config.subscriber.max_jitter);
}