import { NetworkGenerator, NetworkGraph } from "../model";
import { Random } from "../utils/random";
import { config } from "../config";
import { buildNetwork } from "../graph/networkGraph";
import { Store } from "../store";

export class ThreeNodeNetwork extends NetworkGenerator {

    generate(): NetworkGraph {
        const node1 = this.store.addNetwordNode();
        const node2 = this.store.addNetwordNode();
        const node3 = this.store.addNetwordNode();

        const edge1 = this.store.addNetwordEdge({
            from_node: node1.id,
            to_node: node2.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            // latency: Random.randomIntFromInterval(config.edge.latency),
            latency: 1
        });

        const edge2 = this.store.addNetwordEdge({
            from_node: node1.id,
            to_node: node3.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            // latency: Random.randomIntFromInterval(config.edge.latency),
            latency: 2
        });

        const edge3 = this.store.addNetwordEdge({
            from_node: node2.id,
            to_node: node3.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            // latency: Random.randomIntFromInterval(config.edge.latency),
            latency: 1
        });

        const edge4 = this.store.addNetwordEdge({
            from_node: node2.id,
            to_node: node1.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            latency: Random.randomIntFromInterval(config.edge.latency),
        });

        const edge5 = this.store.addNetwordEdge({
            from_node: node3.id,
            to_node: node1.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            latency: Random.randomIntFromInterval(config.edge.latency),
        });

        const edge6 = this.store.addNetwordEdge({
            from_node: node3.id,
            to_node: node2.id,
            bw: Random.randomIntFromInterval(config.edge.bw),
            jitter: Random.randomIntFromInterval(config.edge.jitter),
            latency: Random.randomIntFromInterval(config.edge.latency),
        });

        const producer1 = this.store.addProducer({
            id: "producer1",
            node: node1.id,
            base_layer_bw: Random.randomIntFromInterval(config.producer.base_layer_bw),
            enhancement_layer_1_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_1_bw),
            enhancement_layer_2_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_2_bw)
        });

        const subscriber1 = this.store.addSubscriber({
            id: "subscriber1",
            node: node2.id,
            priority: 'GOLD'
        });

        const videoRequest1 = this.store.addVideoRequest({
            producer: producer1.id,
            subscriber: subscriber1.id,
            layer: Random.layer()
        });

        const g = buildNetwork(this.store.allNodes(), this.store.allEdges());
        const producers = this.store.allProducers();
        const subscribers = this.store.allSubscribers();
        const requests = this.store.allVideoRequests();

        return {
            graph: g,
            producers: producers,
            subscribers: subscribers,
            requests: requests
        }
    }


}