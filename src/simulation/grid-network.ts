import { NetworkGenerator, NetworkGraph, NetworkNode } from "../model";
import { Random } from "../utils/random";
import { config } from "../config";
import { buildNetwork } from "../graph/networkGraph";
import { Store } from "../store";

export class GridNetwork extends NetworkGenerator {

    constructor(store: Store, private n: number) {
        super(store);
    };

    private nodeInGrid(i: number, j: number): NetworkNode {
        const nodes = this.store.allNodes();
        return nodes[this.n * i + j];
    }

    public generate(): NetworkGraph {

        for (let i = 0; i < this.n * this.n; i++) {
            this.store.addNetwordNode();
        }

        const nodes = this.store.allNodes();

        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                const bw = Random.randomIntFromInterval(config.edge.bw);
                const jitter = Random.randomIntFromInterval(config.edge.jitter);
                const latency = Random.randomIntFromInterval(config.edge.latency);
                // down
                if (i + 1 < this.n) {
                    this.store.addNetwordEdge({
                        from_node: this.nodeInGrid(i, j).id,
                        to_node: this.nodeInGrid(i + 1, j).id,
                        bw: bw,
                        jitter: jitter,
                        latency: latency
                    });
                };
                // up
                if (i - 1 >= 0) {
                    this.store.addNetwordEdge({
                        from_node: this.nodeInGrid(i, j).id,
                        to_node: this.nodeInGrid(i - 1, j).id,
                        bw: bw,
                        jitter: jitter,
                        latency: latency
                    });
                };
                // right
                if (j + 1 < this.n) {
                    this.store.addNetwordEdge({
                        from_node: this.nodeInGrid(i, j).id,
                        to_node: this.nodeInGrid(i, j + 1).id,
                        bw: bw,
                        jitter: jitter,
                        latency: latency
                    });
                };

                // left
                if (j - 1 >= 0) {
                    this.store.addNetwordEdge({
                        from_node: this.nodeInGrid(i, j).id,
                        to_node: this.nodeInGrid(i, j - 1).id,
                        bw: bw,
                        jitter: jitter,
                        latency: latency
                    });
                }

            }
        }

        const producer1 = this.store.addProducer({
            id: "producer1",
            node: nodes.find(node => { return node.id === "node1" }).id,
            base_layer_bw: 1,
            // base_layer_bw: Random.randomIntFromInterval(config.producer.base_layer_bw),
            enhancement_layer_1_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_1_bw),
            enhancement_layer_2_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_2_bw)
        });

        const producer2 = this.store.addProducer({
            id: "producer2",
            node: nodes.find(node => { return node.id === "node9" }).id,
            base_layer_bw: 1,
            enhancement_layer_1_bw: 100,
            enhancement_layer_2_bw: 100
            // base_layer_bw: Random.randomIntFromInterval(config.producer.base_layer_bw),
            // enhancement_layer_1_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_1_bw),
            // enhancement_layer_2_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_2_bw)
        });

        const subscriber1 = this.store.addSubscriber({
            id: "subscriber1",
            node: nodes.find(node => { return node.id === "node11" }).id,
            priority: 'GOLD'
        });

        const subscriber2 = this.store.addSubscriber({
            id: "subscriber2",
            node: nodes.find(node => { return node.id === "node15" }).id,
            priority: 'GOLD'
        });
        const videoRequest1 = this.store.addVideoRequest({
            producer: producer1.id,
            subscriber: subscriber1.id,
            layer: 'BASE'
            // layer: Random.layer()
        });

        const videoRequest2 = this.store.addVideoRequest({
            producer: producer2.id,
            subscriber: subscriber2.id,
            layer: 'BASE'
            // layer: Random.layer()
        });

        const videoRequest3 = this.store.addVideoRequest({
            producer: producer2.id,
            subscriber: subscriber2.id,
            layer: 'EL1'
            // layer: Random.layer()
        });

        const videoRequest4 = this.store.addVideoRequest({
            producer: producer2.id,
            subscriber: subscriber2.id,
            layer: 'EL2'
            // layer: Random.layer()
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