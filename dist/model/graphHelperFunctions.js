"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
class GraphHelperFunctions {
    // static addSingleElementToGraph(graph: graphlib.Graph, node: string ,element: Producer | Subscriber): graphlib.Graph {
    //     let label = Util.getNodeLabel(graph, node);
    //     if( element instanceof Producer ) {
    //         label.producers.push(element);
    //     }
    //     if( element instanceof Subscriber ) {
    //         label.subscribers.push(element);
    //     }
    //     graph.setNode(node, label);
    //     return graph;
    // }    
    // static addMultipleElementsToGraph(graph: graphlib.Graph ,elements: Producer[] | Subscriber[]): graphlib.Graph {
    //     elements.forEach(element => {
    //         const randomNode = Util.randomFromArray(graph.nodes());            
    //         GraphHelperFunctions.addSingleElementToGraph(graph, randomNode, element);
    //     })
    //     return graph;
    // }
    static addMultipleSubscribersToGraph(graph, subscribers) {
        subscribers.forEach(subscriber => {
            const randomNode = util_1.Util.randomFromArray(graph.nodes());
            const label = util_1.Util.getNodeLabel(graph, randomNode);
            label.subscribers.push(subscriber);
            graph.setNode(randomNode, label);
        });
        return graph;
    }
    static addMultipleProducersToGraph(graph, tree, producers) {
        producers.forEach(producer => {
            const randomNode = util_1.Util.randomFromArray(graph.nodes());
            const label = util_1.Util.getNodeLabel(graph, randomNode);
            label.producers.push(producer);
            graph.setNode(randomNode, label);
        });
        return graph;
    }
}
exports.GraphHelperFunctions = GraphHelperFunctions;
//# sourceMappingURL=graphHelperFunctions.js.map