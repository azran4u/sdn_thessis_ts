import { Producer, LAYER, NetworkEdge, NetworkPath, EntityId, VideoRequest, ContentTreeNetworkNode, NetworkNode, PathToTree } from "../model";
import * as graphlib from 'graphlib';
import { config } from '../config';
import _ from 'lodash';

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
    // path.edges.forEach(edge => {
    //     const node = src.node(edge.from_node) as NetworkNode;
    //     dst.setNode(node.id, { id: node.id, e2e } as ContentTreeNetworkNode)

    // })
    return dst;
}

export function isValidPath(path: NetworkPath): boolean {
    return (path.latency < config.subscriber.max_latency) &&
        (path.jitter < config.subscriber.max_jitter);
}

export function selectBestPath(paths: PathToTree[]): PathToTree {
    if (paths.length === 0) throw new Error('invalid input to selectBestPath');
    const minLatency = _.minBy(paths, path => { return path.path.latency }).path.latency;
    const lowestLatencyPaths = paths.filter(path => { return path.path.latency === minLatency });
    const minJitter = _.minBy(lowestLatencyPaths, path => { return path.path.jitter }).path.jitter;
    const lowestJitterPaths = lowestLatencyPaths.filter(path => { return path.path.jitter === minJitter });
    const minHopCount = _.minBy(lowestJitterPaths, path => { return path.path.edges.length }).path.edges.length;
    const lowestHopCountPaths = lowestJitterPaths.filter(path => { return path.path.edges.length === minHopCount });
    return lowestHopCountPaths[0];
}