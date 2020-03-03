"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphlib = __importStar(require("graphlib"));
const model_1 = require("./model");
const uuid_1 = __importDefault(require("uuid"));
const config_1 = require("./config");
const lodash_1 = __importDefault(require("lodash"));
function createRandomProducers(count) {
    const producers = [];
    for (let i = 0; i < count; i++) {
        producers.push({
            id: uuid_1.default.v4(),
            bw: {
                BASE_LAYER: randomIntFromInterval(config_1.config.producer.bw.BASE_LAYER),
                EL1: randomIntFromInterval(config_1.config.producer.bw.EL1),
                EL2: randomIntFromInterval(config_1.config.producer.bw.EL2),
            }
        });
    }
    return producers;
}
exports.createRandomProducers = createRandomProducers;
;
function createRandomSubscribers(count) {
    const subscribers = [];
    for (let i = 0; i < count; i++) {
        subscribers.push({
            id: uuid_1.default.v4(),
            priority: randomSubscriberPriority()
        });
    }
    return subscribers;
}
exports.createRandomSubscribers = createRandomSubscribers;
;
function createRandomRequests(subscribers, producers, count) {
    const requests = [];
    const subscribersCopy = lodash_1.default.cloneDeep(subscribers);
    // we cannot create more requests than number of subscribers
    const maxNumberOfRequests = Math.min(count, subscribersCopy.length);
    for (let i = 0; i < maxNumberOfRequests; i++) {
        const randomSubscriber = randomFromArray(subscribersCopy);
        // each subscriber has only one request so we remove it from subsequent random selection
        subscribersCopy.splice(subscribersCopy.indexOf(randomSubscriber, 0), 1);
        const randomProducer = randomFromArray(producers);
        const randomVideoLayer = randomRequestVideoLayer();
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
            case model_1.LAYER.BASE_LAYER:
                {
                    requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: model_1.LAYER.BASE_LAYER }));
                    break;
                }
                ;
            case model_1.LAYER.EL1:
                {
                    requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: model_1.LAYER.BASE_LAYER }));
                    requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: model_1.LAYER.EL1 }));
                    break;
                }
                ;
            case model_1.LAYER.EL2:
                {
                    requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: model_1.LAYER.BASE_LAYER }));
                    requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: model_1.LAYER.EL1 }));
                    requests.push(Object.assign(Object.assign({}, request), { id: uuid_1.default.v4(), layer: model_1.LAYER.EL2 }));
                    break;
                }
                ;
        }
    }
    return requests;
}
exports.createRandomRequests = createRandomRequests;
;
function randomSubscriberPriority() {
    return randomEnum(model_1.SUBSCRIBER_PRIORITY);
}
exports.randomSubscriberPriority = randomSubscriberPriority;
function randomRequestVideoLayer() {
    return randomEnum(model_1.LAYER);
}
exports.randomRequestVideoLayer = randomRequestVideoLayer;
function randomEnum(anEnum) {
    const enumValues = Object.keys(anEnum)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n));
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEnumValue = enumValues[randomIndex];
    return randomEnumValue;
}
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function randomIntFromInterval(range) {
    const min = range.min;
    const max = range.max;
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function createRandomEdge() {
    return {
        id: uuid_1.default.v4(),
        bw: randomIntFromInterval(config_1.config.edge.bw),
        jitter: randomIntFromInterval(config_1.config.edge.jitter),
        latency: randomIntFromInterval(config_1.config.edge.latency),
        requests: []
    };
}
function createRandomNode() {
    return {
        id: uuid_1.default.v4(),
        producers: [],
        subscribers: [],
        requests: []
    };
}
function createSimpleGraph() {
    const g = new graphlib.Graph({
        directed: true
    });
    g.setNode('a', createRandomNode());
    g.setNode('b', createRandomNode());
    g.setNode('c', createRandomNode());
    g.setEdge('a', 'b', createRandomEdge());
    g.setEdge('b', 'a', createRandomEdge());
    g.setEdge('b', 'c', createRandomEdge());
    g.setEdge('c', 'b', createRandomEdge());
    g.setEdge('a', 'c', createRandomEdge());
    g.setEdge('c', 'a', createRandomEdge());
    return g;
}
exports.createSimpleGraph = createSimpleGraph;
;
//# sourceMappingURL=network-util-functions.js.map