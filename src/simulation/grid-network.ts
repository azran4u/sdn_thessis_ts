import {
  EntityId,
  LAYER,
  NetworkGenerator,
  NetworkGraph,
  NetworkNode,
  SUBSCRIBER_PRIORITY,
} from "../model";
import { buildNetwork } from "../graph/networkGraph";
import { Store } from "../store";

export class Grid4x4Network extends NetworkGenerator {
  private numOfNodes: number;
  private n = 4;
  constructor(store: Store, private numberOfRequests: number) {
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

    const producerNodes = ["node4", "node8", "node12", "node16"];
    producerNodes.forEach((producerNode, index) => {
      this.store.addProducer({
        id: `producer-${index+1}`,
        node: nodes.find((node) => {
          return node.id === producerNode;
        }).id,
        base_layer_bw: 1,
        enhancement_layer_1_bw: 3,
        enhancement_layer_2_bw: 0,
      });
    });

    const subscriberNodes: Array<{
      node: string;
      priority: SUBSCRIBER_PRIORITY;
    }> = [
      { node: "node1", priority: "GOLD" },
      { node: "node5", priority: "GOLD" },
      { node: "node9", priority: "GOLD" },
      { node: "node13", priority: "GOLD" },
      { node: "node2", priority: "GOLD" },
      { node: "node6", priority: "GOLD" },
    ];
    subscriberNodes.forEach((subscriberNode, index) => {
      this.store.addSubscriber({
        id: `subscriber-${index+1}`,
        node: nodes.find((node) => {
          return node.id === subscriberNode.node;
        }).id,
        priority: subscriberNode.priority,
      });
    });

    const videoRequests: Array<{
      subscriber: EntityId;
      producer: EntityId;
      layer: LAYER;
    }> = [
      { subscriber: "subscriber-1", producer: "producer-1", layer: "BASE" },
      { subscriber: "subscriber-2", producer: "producer-2", layer: "BASE" },
      { subscriber: "subscriber-3", producer: "producer-3", layer: "BASE" },
      { subscriber: "subscriber-4", producer: "producer-4", layer: "BASE" },
      { subscriber: "subscriber-5", producer: "producer-1", layer: "BASE" },
      { subscriber: "subscriber-6", producer: "producer-2", layer: "BASE" },

      { subscriber: "subscriber-1", producer: "producer-1", layer: "EL1" },
      { subscriber: "subscriber-2", producer: "producer-2", layer: "EL1" },
      { subscriber: "subscriber-3", producer: "producer-3", layer: "EL1" },
      { subscriber: "subscriber-4", producer: "producer-4", layer: "EL1" },
      { subscriber: "subscriber-5", producer: "producer-1", layer: "EL1" },
      { subscriber: "subscriber-6", producer: "producer-2", layer: "EL1" },

      { subscriber: "subscriber-1", producer: "producer-2", layer: "BASE" },
      { subscriber: "subscriber-2", producer: "producer-3", layer: "BASE" },
      { subscriber: "subscriber-3", producer: "producer-4", layer: "BASE" },
      { subscriber: "subscriber-4", producer: "producer-1", layer: "BASE" },
    ];

    for (let i = 0; i < this.numberOfRequests; i++) {
      const request = videoRequests[i];
      this.store.addVideoRequest(request);
    }

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
