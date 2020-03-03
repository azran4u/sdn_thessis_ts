"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphlib = __importStar(require("graphlib"));
const lbs_1 = require("../../algorithms/lbs");
const producer_1 = require("../../model/producer");
const subscriber_1 = require("../../model/subscriber");
const videoRequest_1 = require("../../model/videoRequest");
const nodeLabel_1 = require("../../model/nodeLabel");
const edgeLabel_1 = require("../../model/edgeLabel");
const graphHelperFunctions_1 = require("../../model/graphHelperFunctions");
class Scenario {
    start() {
        let tree;
        const graph = Scenario.createSimpleGraph();
        const producers = producer_1.Producer.createRandom(2);
        graphHelperFunctions_1.GraphHelperFunctions.addMultipleProducersToGraph(graph, tree, producers);
        const subscribers = subscriber_1.Subscriber.createRandom(2);
        graphHelperFunctions_1.GraphHelperFunctions.addMultipleSubscribersToGraph(graph, subscribers);
        const requests = videoRequest_1.VideoRequest.createRandom(subscribers, producers, 2);
        const network = {
            graph: graph,
            producers: producers,
            subscribers: subscribers,
            requests: requests
        };
        const lbsNetwork = lbs_1.lbs(network);
        console.log(network);
        return { input: network, output: network };
    }
    static createSimpleGraph() {
        const g = new graphlib.Graph({
            directed: true
        });
        g.setNode('a', nodeLabel_1.NodeLabel.createRandom());
        g.setNode('b', nodeLabel_1.NodeLabel.createRandom());
        g.setNode('c', nodeLabel_1.NodeLabel.createRandom());
        g.setEdge('a', 'b', edgeLabel_1.EdgeLabel.createRandom());
        g.setEdge('b', 'a', edgeLabel_1.EdgeLabel.createRandom());
        g.setEdge('b', 'c', edgeLabel_1.EdgeLabel.createRandom());
        g.setEdge('c', 'b', edgeLabel_1.EdgeLabel.createRandom());
        g.setEdge('a', 'c', edgeLabel_1.EdgeLabel.createRandom());
        g.setEdge('c', 'a', edgeLabel_1.EdgeLabel.createRandom());
        return g;
    }
    ;
}
exports.Scenario = Scenario;
//# sourceMappingURL=scenario.js.map