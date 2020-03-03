"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    static randomEnum(anEnum) {
        const enumValues = Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n));
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        const randomEnumValue = enumValues[randomIndex];
        return randomEnumValue;
    }
    static randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    static randomIntFromInterval(range) {
        const min = range.min;
        const max = range.max;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    static getNodeLabel(graph, node) {
        return graph.node(node);
    }
    static getEdgeLabel(graph, edge) {
        return graph.edge(edge);
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map