"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const util_1 = require("../util");
var SUBSCRIBER_PRIORITY;
(function (SUBSCRIBER_PRIORITY) {
    SUBSCRIBER_PRIORITY[SUBSCRIBER_PRIORITY["GOLD"] = 0] = "GOLD";
    SUBSCRIBER_PRIORITY[SUBSCRIBER_PRIORITY["SILVER"] = 1] = "SILVER";
    SUBSCRIBER_PRIORITY[SUBSCRIBER_PRIORITY["BRONZE"] = 2] = "BRONZE";
})(SUBSCRIBER_PRIORITY = exports.SUBSCRIBER_PRIORITY || (exports.SUBSCRIBER_PRIORITY = {}));
// subscriber is a video consumer
class Subscriber {
    static createRandom(count) {
        const subscribers = [];
        for (let i = 0; i < count; i++) {
            subscribers.push({
                id: uuid.v4(),
                priority: Subscriber.randomPriority()
            });
        }
        return subscribers;
    }
    ;
    static randomPriority() {
        return util_1.Util.randomEnum(SUBSCRIBER_PRIORITY);
    }
}
exports.Subscriber = Subscriber;
//# sourceMappingURL=subscriber.js.map