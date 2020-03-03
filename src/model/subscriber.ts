import uuid = require("uuid");
import { Util } from "../util";

export enum SUBSCRIBER_PRIORITY {
    'GOLD',
    'SILVER',
    'BRONZE',
}
// subscriber is a video consumer
export class Subscriber {
    id: string;
    priority: SUBSCRIBER_PRIORITY;    

    static createRandom(count: number): Subscriber[] {
        const subscribers: Subscriber[] = [];
        for (let i = 0; i < count; i++) {
            subscribers.push({
                id: uuid.v4(),
                priority: Subscriber.randomPriority()
            })
        }
        return subscribers;
    };

    private static randomPriority(): SUBSCRIBER_PRIORITY {
        return Util.randomEnum(SUBSCRIBER_PRIORITY);
    }
}