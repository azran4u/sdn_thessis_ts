import _ from 'lodash';
import * as graphlib from 'graphlib';
import { Algorithm, AlgorithmOutput, VideoRequestResult, VIDEO_REQUEST_STATUS, NetworkEdge, NetworkGraph, NetworkPath, ContentTreeNetworkNode, PathToTree } from '../model';
import { getProducerBwByLayer, contentToKey, dijkstra, removeVideoRequestsWithHigherLayer, isValidPath } from './utils';
import { config } from '../config';

export class LBS implements Algorithm {
    run(input: NetworkGraph): AlgorithmOutput {
        // deep copy to preserve the original network
        // const originalNetwork = _.cloneDeep(network);

        const contentTrees = new Map<string, graphlib.Graph>();

        const videoRequestResults: VideoRequestResult[] = [];
        // const vubscVideoRequestResultEdgesribers: VideoRequestResultEdges[] = [];

        // init the map with empty graph for each content
        for (const request of input.requests) {
            const g = new graphlib.Graph({
                directed: true,
                multigraph: false, // tree isn't multigraph
                compound: false
            });

            // add the node the producer is connected to
            const producer = input.producers.find(x => x.id === request.producer);
            const node = producer.node;
            // g.setNode(node, input.graph.node(node));
            g.setNode(node, {
                id: input.graph.node(node),
                e2e_latency: 0,
                e2e_jitter: 0
            } as ContentTreeNetworkNode);
            contentTrees.set(contentToKey(request.producer, request.layer), g);
        }

        // sort requests by layer
        let sortedRequests = _.orderBy(input.requests, ['layer'], ['asc']);

        for (const request of sortedRequests) {

            const result = videoRequestResults.find(x => x.videoRequest === request.id);

            if (
                (result && result.status === VIDEO_REQUEST_STATUS.SERVED) ||
                (result && result.status === VIDEO_REQUEST_STATUS.INVALID)) {
                return;
            }

            // P holds all possible paths
            const P: PathToTree[] = [];

            // remove edges that don't meet the bandwidth requiremnt
            const producer = input.producers.find(x => x.id === request.producer);
            const subscriber = input.subscribers.find(x => x.id === request.subscriber);
            const requestBw = getProducerBwByLayer(producer, request.layer);

            const H = _.cloneDeep(input.graph);
            _.forEach(H.edges(), (e) => {
                const edge = H.edge(e) as any as NetworkEdge;
                if (edge.bw < requestBw) {
                    H.removeEdge(e);
                }
            });

            // get all nodes that are part of (producer,layer)
            const tree = contentTrees.get(contentToKey(request.producer, request.layer));
            const scki = tree.nodes();

            for (const v of scki) {
                // find shortest latency path in H
                const path = dijkstra(H, v, subscriber.node);
                // LBS doesn't check the e2e latency and jitter but only to the tree intersection point
                if (isValidPath(path)) {
                    P.push({ path: path, node: tree.node(v) });
                }
            }
            // no paths found for this request
            if (P.length === 0) {
                // remove requests to this subscriber with higher layers
                sortedRequests = removeVideoRequestsWithHigherLayer(sortedRequests, request);
            } else {
                // find best path

                // add best path to content tree
            }
        }
        return {
            videoRequestResult: undefined,
            videoRequestResultEdges: undefined
        };
    }
}

