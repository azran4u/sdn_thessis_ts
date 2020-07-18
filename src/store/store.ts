import * as NodeCache from 'node-cache';
import { NetworkNode, NetworkEdge, NetworkPath, Producer, Subscriber, VideoRequestResult, VideoRequestResultEdges, VideoRequest } from '../model';
import { v4 as uuidv4 } from 'uuid';

const Cache = NodeCache.default;

export class Store {
    private networkNodeStore: NodeCache;
    private networkEdgeStore: NodeCache;
    private networkPathStore: NodeCache;
    private producerStore: NodeCache;
    private subscriberStore: NodeCache;
    private videoRequestStore: NodeCache;
    private videoRequestResultStore: NodeCache;
    private videoRequestResultEdgesStore: NodeCache;
    private nodeSequence: number = 0;
    private edgeSequence: number = 0;

    constructor() {
        this.networkNodeStore = new Cache();
        this.networkEdgeStore = new Cache();
        this.networkPathStore = new Cache();
        this.producerStore = new Cache();
        this.subscriberStore = new Cache();
        this.videoRequestStore = new Cache();
        this.videoRequestResultStore = new Cache();
        this.videoRequestResultEdgesStore = new Cache();
    }

    addNetwordNode(): NetworkNode {
        this.nodeSequence++;
        const key = `node${this.nodeSequence}`;
        this.networkNodeStore.set<NetworkNode>(key, { id: key });
        return this.networkNodeStore.get(key);
    }

    addNetwordEdge(edge: Omit<NetworkEdge, 'id'>): NetworkEdge {
        this.edgeSequence++;
        const key = `edge${this.edgeSequence}`;
        this.networkEdgeStore.set<NetworkEdge>(key, { id: key, ...edge });
        return this.networkEdgeStore.get(key);
    }

    // addNetworkPath(path: Omit<NetworkPath, 'id'>): NetworkPath {
    //     const key = uuidv4();
    //     this.networkPathStore.set<NetworkPath>(key, { id: key, ...path });
    //     return this.networkPathStore.get(key);
    // }

    addProducer(producer: Omit<Producer, 'id'>): Producer {
        const key = uuidv4();
        this.producerStore.set<Producer>(key, { id: key, ...producer });
        return this.producerStore.get(key);
    }

    addSubscriber(subscriber: Omit<Subscriber, 'id'>): Subscriber {
        const key = uuidv4();
        this.subscriberStore.set<Subscriber>(key, { id: key, ...subscriber });
        return this.subscriberStore.get(key);
    }

    addVideoRequest(videoRequest: Omit<VideoRequest, 'id'>): VideoRequest {
        const key = uuidv4();
        this.videoRequestStore.set<VideoRequest>(key, { id: key, ...videoRequest });
        return this.videoRequestStore.get(key);
    }

    addVideoRequestResult(videoRequestResult: Omit<VideoRequestResult, 'id'>): VideoRequestResult {
        const key = uuidv4();
        this.videoRequestResultStore.set<VideoRequestResult>(key, { id: key, ...videoRequestResult });
        return this.videoRequestResultStore.get(key);
    }

    addVideoRequestResultEdges(videoRequestResultEdges: Omit<VideoRequestResultEdges, 'id'>): VideoRequestResultEdges {
        const key = uuidv4();
        this.videoRequestResultEdgesStore.set<VideoRequestResultEdges>(key, { id: key, ...videoRequestResultEdges });
        return this.videoRequestResultEdgesStore.get(key);
    }

    allNodes(): NetworkNode[] {
        return this.networkNodeStore.keys().map(key => {
            return this.networkNodeStore.get(key);
        })
    }

    allEdges(): NetworkEdge[] {
        return this.networkEdgeStore.keys().map(key => {
            return this.networkEdgeStore.get(key);
        })
    }

    allProducers(): Producer[] {
        return this.producerStore.keys().map(key => {
            return this.producerStore.get(key);
        })
    }

    allSubscribers(): Subscriber[] {
        return this.subscriberStore.keys().map(key => {
            return this.subscriberStore.get(key);
        })
    }

    allVideoRequests(): VideoRequest[] {
        return this.videoRequestStore.keys().map(key => {
            return this.videoRequestStore.get(key);
        })
    }
}

