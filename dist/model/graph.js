"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const producer_1 = require("./producer");
const util_1 = require("../util");
const subscriber_1 = require("./subscriber");
class Graph {
    static addElementToGraph(graph, nodeid, element) {
        const foundNode = graph.nodes().find(node => {
            const nodeLabel = util_1.Util.getNodeLabel(graph, node);
            if (nodeLabel.id === nodeid)
                return true;
            return false;
        });
        if (element instanceof producer_1.Producer) {
            util_1.Util.getNodeLabel(graph, foundNode).producers.push(element);
        }
        if (element instanceof subscriber_1.Subscriber) {
            util_1.Util.getNodeLabel(graph, foundNode).subscribers.push(element);
        }
        return graph;
    }
    static addElementsToGraph(graph, elements) {
        elements.forEach(element => {
            const randomNode = util_1.Util.randomFromArray(graph.nodes());
            const randomNodeLabel = util_1.Util.getNodeLabel(graph, randomNode);
            Graph.addElementToGraph(graph, randomNodeLabel.id, element);
        });
        return graph;
    }
    static addProdecersToGraph(graph, producers) {
        return Graph.addElementsToGraph(graph, producers);
    }
    static addSubscribersToGraph(graph, subscribers) {
        return Graph.addElementsToGraph(graph, subscribers);
    }
}
exports.Graph = Graph;
//# sourceMappingURL=graph.js.map