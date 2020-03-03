"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const network_util_functions_1 = require("./network-util-functions");
const lbs_1 = require("./lbs");
function start() {
    const graph = network_util_functions_1.createSimpleGraph();
    const producers = network_util_functions_1.createRandomProducers(2);
    const subscribers = network_util_functions_1.createRandomSubscribers(2);
    const requests = network_util_functions_1.createRandomRequests(subscribers, producers, 2);
    const network = {
        graph: graph,
        producers: producers,
        subscribers: subscribers,
        requests: requests
    };
    const lbsNetwork = lbs_1.lbs(network);
    console.log(network);
}
exports.start = start;
//# sourceMappingURL=simulation.js.map