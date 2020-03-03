"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class NodeLabel {
    static createRandom() {
        return {
            id: uuid.v4(),
            producers: [],
            subscribers: [],
            requests: []
        };
    }
}
exports.NodeLabel = NodeLabel;
//# sourceMappingURL=nodeLabel.js.map