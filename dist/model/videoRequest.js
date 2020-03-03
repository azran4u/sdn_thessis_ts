"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../util");
const uuid_1 = __importDefault(require("uuid"));
const layer_1 = require("./layer");
class VideoRequest {
    static createRandom(subscribers, producers, count) {
        const requests = [];
        const subscribersCopy = lodash_1.default.cloneDeep(subscribers);
        // we cannot create more requests than number of subscribers
        const maxNumberOfRequests = Math.min(count, subscribersCopy.length);
        for (let i = 0; i < maxNumberOfRequests; i++) {
            const randomSubscriber = util_1.Util.randomFromArray(subscribersCopy);
            // each subscriber has only one request so we remove it from subsequent random selection
            subscribersCopy.splice(subscribersCopy.indexOf(randomSubscriber, 0), 1);
            const randomProducer = util_1.Util.randomFromArray(producers);
            const randomVideoLayer = VideoRequest.randomVideoLayer();
            const request = {
                id: uuid_1.default.v4(),
                subscriber: randomSubscriber,
                producer: randomProducer,
                layer: randomVideoLayer,
                isServed: false,
                revenue: 0,
                valid: true
            };
            switch (randomVideoLayer) {
                case layer_1.LAYER.BASE_LAYER:
                    {
                        requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: layer_1.LAYER.BASE_LAYER }));
                        break;
                    }
                    ;
                case layer_1.LAYER.EL1:
                    {
                        requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: layer_1.LAYER.BASE_LAYER }));
                        requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: layer_1.LAYER.EL1 }));
                        break;
                    }
                    ;
                case layer_1.LAYER.EL2:
                    {
                        requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: layer_1.LAYER.BASE_LAYER }));
                        requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: layer_1.LAYER.EL1 }));
                        requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: layer_1.LAYER.EL2 }));
                        break;
                    }
                    ;
            }
        }
        return requests;
    }
    ;
    static randomVideoLayer() {
        return util_1.Util.randomEnum(layer_1.LAYER);
    }
}
exports.VideoRequest = VideoRequest;
//# sourceMappingURL=videoRequest.js.map