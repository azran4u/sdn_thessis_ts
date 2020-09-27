import { NetworkGenerator, NetworkGraph, NetworkNode } from "../model";
import { buildNetwork } from "../graph/networkGraph";
import { Store } from "../store";
import { GraphUtil } from "../algorithms/utils";

export class Grid4x4Network extends NetworkGenerator {
  private numOfNodes: number;
  private n = 100;
  constructor(store: Store) {
    super(store);
    this.numOfNodes = this.n * this.n;
  }

  private nodeInGrid(i: number, j: number): NetworkNode {
    const nodes = this.store.allNodes();
    return nodes[this.n * i + j];
  }

  public generate(): NetworkGraph {
    for (let i = 0; i < this.numOfNodes; i++) {
      this.store.addNetwordNode();
    }

    const nodes = this.store.allNodes();

    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const bw = 4;
        const jitter = 0;
        const latency = 1;
        // down
        if (i + 1 < this.n) {
          this.store.addNetwordEdge({
            from_node: this.nodeInGrid(i, j).id,
            to_node: this.nodeInGrid(i + 1, j).id,
            bw: bw,
            jitter: jitter,
            latency: latency,
          });
        }
        // up
        if (i - 1 >= 0) {
          this.store.addNetwordEdge({
            from_node: this.nodeInGrid(i, j).id,
            to_node: this.nodeInGrid(i - 1, j).id,
            bw: bw,
            jitter: jitter,
            latency: latency,
          });
        }
        // right
        if (j + 1 < this.n) {
          this.store.addNetwordEdge({
            from_node: this.nodeInGrid(i, j).id,
            to_node: this.nodeInGrid(i, j + 1).id,
            bw: bw,
            jitter: jitter,
            latency: latency,
          });
        }

        // left
        if (j - 1 >= 0) {
          this.store.addNetwordEdge({
            from_node: this.nodeInGrid(i, j).id,
            to_node: this.nodeInGrid(i, j - 1).id,
            bw: bw,
            jitter: jitter,
            latency: latency,
          });
        }
      }
    }

    const producerNodes = ["node1", "node5", "node15", "node16"];
    producerNodes.forEach((producerNode, index) => {
      this.store.addProducer({
        id: `producer-${index}`,
        node: nodes.find((node) => {
          return node.id === producerNode;
        }).id,
        base_layer_bw: 1,
        enhancement_layer_1_bw: 3,
        enhancement_layer_2_bw: 0,
      });
    });

    const subscriberNodes = [
      "node4",
      "node8",
      "node10",
      "node11",
      "node12",
      "node13",
    ];
    subscriberNodes.forEach((subscriberNode, index) => {
      const allProducers = this.store.allProducers();
      const numOfPrducers = allProducers.length;
      const producer = allProducers[index % numOfPrducers];

      const subscriber = this.store.addSubscriber({
        id: `subscriber-${index}`,
        node: nodes.find((node) => {
          return node.id === subscriberNode;
        }).id,
        priority: GraphUtil.isOdd(index) ? "GOLD" : "SILVER",
      });

      const videoRequest1 = this.store.addVideoRequest({
        producer: producer.id,
        subscriber: subscriber.id,
        layer: "BASE",
      });

      const videoRequest2 = this.store.addVideoRequest({
        producer: producer.id,
        subscriber: subscriber.id,
        layer: "EL1",
      });
    });
    const g = buildNetwork(this.store.allNodes(), this.store.allEdges());
    const producers = this.store.allProducers();
    const subscribers = this.store.allSubscribers();
    const requests = this.store.allVideoRequests();

    return {
      graph: g,
      producers: producers,
      subscribers: subscribers,
      requests: requests,
    };
  }
}
