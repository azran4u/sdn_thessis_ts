"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const util_1 = require("../util");
const config_1 = require("../config");
class EdgeLabel {
    static createRandom() {
        return {
            id: uuid.v4(),
            bw: util_1.Util.randomIntFromInterval(config_1.config.edge.bw),
            jitter: util_1.Util.randomIntFromInterval(config_1.config.edge.jitter),
            latency: util_1.Util.randomIntFromInterval(config_1.config.edge.latency),
            requests: []
        };
    }
}
exports.EdgeLabel = EdgeLabel;
//# sourceMappingURL=edgeLabel.js.map