import { Subscriber } from "./subscriber";
import { Producer } from "./producer";
import { VideoRequest } from "./videoRequest";
import uuid = require("uuid");

export class NodeLabel {
    id: string;    
    subscribers: Subscriber[];
    producers: Producer[];

    // array of requests ids that use this node
    requests: VideoRequest[];

    static createRandom(): NodeLabel {
        return {
            id: uuid.v4(),
            producers: [],
            subscribers: [],
            requests: []
        };
    }
}