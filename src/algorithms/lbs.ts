import _ from 'lodash';
import * as graphlib from 'graphlib';
import { Algorithm, AlgorithmOutput, VIDEO_REQUEST_STATUS, NetworkGraph, ContentTreeNetworkNode, PathToTree, ALGORITHM, VideoRequestResultInput, NetworkNode } from '../model';
import { GraphUtil } from './utils';

export class LBS implements Algorithm {
    run(input: NetworkGraph): AlgorithmOutput {

        const contentTrees = new Map<string, graphlib.Graph>();

        const videoRequestResults: VideoRequestResultInput[] = [];

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
                e2e_hopCount: 1,
                e2e_latency: 0,
                e2e_jitter: 0
            } as ContentTreeNetworkNode);
            contentTrees.set(GraphUtil.contentToKey(request.producer, request.layer), g);
        }

        // sort requests by layer
        let sortedRequests = _.orderBy(input.requests, ['layer'], ['asc']);

        for (const request of sortedRequests) {

            const result = videoRequestResults.find(x => x.videoRequestId === request.id);

            if (
                (result && result.status === VIDEO_REQUEST_STATUS.SERVED) ||
                (result && result.status === VIDEO_REQUEST_STATUS.INVALID)) {
                continue;
            }

            // P holds all possible paths
            const P: PathToTree[] = [];

            // remove edges that don't meet the bandwidth requiremnt
            const producer = input.producers.find(x => x.id === request.producer);
            const subscriber = input.subscribers.find(x => x.id === request.subscriber);
            const requestBw = GraphUtil.getProducerBwByLayer(producer, request.layer);

            const H = GraphUtil.removeEdgesWithoutEnoughBw(input.graph, requestBw);

            // get all nodes that are part of (producer,layer)
            let tree = contentTrees.get(GraphUtil.contentToKey(request.producer, request.layer));
            const scki = tree.nodes();

            for (const v of scki) {
                // find shortest latency path in H
                const path = GraphUtil.dijkstra(H, v, subscriber.node);
                // LBS doesn't check the e2e latency and jitter but only to the tree intersection point
                if (GraphUtil.isValidPath(path)) {
                    P.push({ path: path, node: H.node(v) });
                }
            }
            // no paths found for this request
            if (P.length === 0) {

                // set video request result to NOT_SREVED
                videoRequestResults.push({
                    alogorithm: ALGORITHM.LBS,
                    videoRequestId: request.id,
                    status: VIDEO_REQUEST_STATUS.NOT_SERVED,
                    e2e_hopCount: -1,
                    e2e_jitter: -1,
                    e2e_latency: -1
                });

                // set upper layer requests INVALID
                const higherLayerRequests = GraphUtil.findHigherLayerRequests(sortedRequests, request);
                higherLayerRequests.forEach(req => {
                    videoRequestResults.push({
                        alogorithm: ALGORITHM.LBS,
                        videoRequestId: req.id,
                        status: VIDEO_REQUEST_STATUS.INVALID,
                        e2e_hopCount: -1,
                        e2e_jitter: -1,
                        e2e_latency: -1
                    });
                })
            } else {
                // find best path
                const bestPath = GraphUtil.selectBestPath(P);

                // update G
                input.graph = GraphUtil.updatePathBwInGraph(bestPath.path, requestBw, input.graph);

                // update content tree
                tree = GraphUtil.addPathToTree(bestPath, tree);
                contentTrees.set(GraphUtil.contentToKey(request.producer, request.layer), tree);

                const lastNode = tree.node(subscriber.node) as ContentTreeNetworkNode;

                // update video request results
                videoRequestResults.push({
                    alogorithm: ALGORITHM.LBS,
                    videoRequestId: request.id,
                    status: VIDEO_REQUEST_STATUS.SERVED,
                    e2e_hopCount: lastNode.e2e_hopCount,
                    e2e_jitter: lastNode.e2e_jitter,
                    e2e_latency: lastNode.e2e_latency
                });
            }
        }
        return {
            videoRequestResult: videoRequestResults,
            contentTrees: contentTrees
        };
    }
}

