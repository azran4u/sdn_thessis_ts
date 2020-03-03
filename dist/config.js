"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    edge: {
        bw: {
            min: 1,
            max: 5
        },
        latency: {
            min: 1,
            max: 10
        },
        jitter: {
            min: 1,
            max: 5
        }
    },
    producer: {
        count: 3,
        bw: {
            BASE_LAYER: { min: 1, max: 10 },
            EL1: { min: 5, max: 15 },
            EL2: { min: 10, max: 20 }
        }
    }
};
//# sourceMappingURL=config.js.map