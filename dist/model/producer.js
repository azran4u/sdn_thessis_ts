"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const uuid = require("uuid");
const util_1 = require("../util");
// producer is a video source with 3 layers
class Producer {
    static createRandom(count) {
        const producers = [];
        for (let i = 0; i < count; i++) {
            producers.push({
                id: uuid.v4(),
                bw: {
                    BASE_LAYER: util_1.Util.randomIntFromInterval(config_1.config.producer.bw.BASE_LAYER),
                    EL1: util_1.Util.randomIntFromInterval(config_1.config.producer.bw.EL1),
                    EL2: util_1.Util.randomIntFromInterval(config_1.config.producer.bw.EL2),
                }
            });
        }
        return producers;
    }
    ;
}
exports.Producer = Producer;
//# sourceMappingURL=producer.js.map