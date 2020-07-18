import { NetworkGenerator, NetworkGraph } from "../model";
import { Random } from "../utils/random";
import { config } from "../config";
import { buildNetwork } from "../graph/networkGraph";
import { Store } from "../store";

export class ThreeNodeNetwork implements NetworkGenerator {

    public generate(store: Store): NetworkGraph {
        const node1 = store.addNetwordNode();
        const node2 = store.addNetwordNode();
        const node3 = store.addNetwordNode();

        const edge1 = store.addNetwordEdge({
            from_node: node1.id,
            to_node: node2.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            // latency: Random.randomIntFromInterval(config.edge.latency),
            latency: 1
        });

        const edge2 = store.addNetwordEdge({
            from_node: node1.id,
            to_node: node3.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            // latency: Random.randomIntFromInterval(config.edge.latency),
            latency: 2
        });

        const edge3 = store.addNetwordEdge({
            from_node: node2.id,
            to_node: node3.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            // latency: Random.randomIntFromInterval(config.edge.latency),
            latency: 1
        });

        const edge4 = store.addNetwordEdge({
            from_node: node2.id,
            to_node: node1.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            latency: Random.randomIntFromInterval(config.edge.latency),
        });

        const edge5 = store.addNetwordEdge({
            from_node: node3.id,
            to_node: node1.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            latency: Random.randomIntFromInterval(config.edge.latency),
        });

        const edge6 = store.addNetwordEdge({
            from_node: node3.id,
            to_node: node2.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            latency: Random.randomIntFromInterval(config.edge.latency),
        });

        const producer1 = store.addProducer({
            node: node1.id,
            base_layer_bw: Random.randomIntFromInterval(config.producer.base_layer_bw),
            enhancement_layer_1_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_1_bw),
            enhancement_layer_2_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_2_bw)
        });

        const subscriber1 = store.addSubscriber({
            node: node2.id,
            priority: 'GOLD'
        });

        const videoRequest1 = store.addVideoRequest({
            producer: producer1.id,
            subscriber: subscriber1.id,
            layer: Random.layer()
        });

        const g = buildNetwork(store.allNodes(), store.allEdges());
        const producers = store.allProducers();
        const subscribers = store.allSubscribers();
        const requests = store.allVideoRequests();

        return {
            graph: g,
            producers: producers,
            subscribers: subscribers,
            requests: requests
        }
    }


}