import _ from 'lodash';
import * as graphlib from 'graphlib';
import { AlgorithmInput, AlgorithmOutput, VideoRequestResult, VideoRequestResultEdges, VIDEO_REQUEST_STATUS, NetworkEdge, LAYER, ALGORITHM, Content, Producer } from '../model';
import { getProducerBwByLayer, contentToKey } from './utils';

export function lbs(input: AlgorithmInput): AlgorithmOutput {
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
        g.setNode(node, input.graph.node(node));
        contentTrees.set(contentToKey(request.producer, request.layer), g);
    }

    // sort requests by layer
    const sortedRequests = _.orderBy(input.requests, ['layer'], ['asc']);

    for (const request of sortedRequests) {

        const result = videoRequestResults.find(x => x.videoRequest === request.id);

        if (result) {
            // if request isn't valid or already served, skip it
            if (result.status === VIDEO_REQUEST_STATUS.SERVED ||
                result.status === VIDEO_REQUEST_STATUS.INVALID) return;
        }

        // P holds all possible paths
        const P = new Set<string[]>();

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
            const edges = H.outEdges(v);
            const paths = graphlib.alg.dijkstra(H, producer.node, (e) => {
                const edge = H.edge(e) as any as NetworkEdge;
                return edge.latency;
            });
            console.log(paths);
        }
    }
    return {
        videoRequestResult: undefined,
        videoRequestResultEdges: undefined
    };
}
