"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../util");
const layer_1 = require("../model/layer");
function lbs(network) {
    // deep copy to preserve the original network
    const originalNetwork = lodash_1.default.cloneDeep(network);
    // sort requests by layer
    network.requests = lodash_1.default.orderBy(network.requests, ['layer'], ['asc']);
    network.requests.forEach(request => {
        // if request isn't valid or already served, skip it
        if (!request.valid || request.isServed)
            return;
        // P holds all possible paths
        const P = [];
        // remove edges that don't meet the bandwidth requiremnt
        const H = lodash_1.default.cloneDeep(network.graph);
        H.edges().forEach(edge => {
            const edgeLabel = H.edge(edge);
            const requestBw = request.producer.bw[layer_1.LAYER[request.layer]];
            if (edgeLabel.bw < requestBw) {
                H.removeEdge(edge);
            }
        });
        // get all nodes that are part of (producer,layer)
        const scki = H.nodes().filter(node => {
            const nodeLabel = util_1.Util.getNodeLabel(H, node);
            const requestInNodeThatMatchCurrentRequest = nodeLabel.requests.find((nodeRequest => {
                if (nodeRequest.id === request.id)
                    return true;
                return false;
            }));
            if (requestInNodeThatMatchCurrentRequest)
                return true;
            return false;
        });
        console.log(scki);
    });
    return originalNetwork;
}
exports.lbs = lbs;
//# sourceMappingURL=lbs.js.map