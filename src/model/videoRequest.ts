// import { Subscriber } from "./subscriber";
// import { Producer } from "./producer";
// import _ from "lodash";
// import { Util } from "../utils/graphlibLabels";
// import uuid from "uuid";
// import { LAYER } from "./layer";

// export class VideoRequest {
//     id: string;
//     subscriber: Subscriber;
//     producer: Producer;
//     // each requested layer is a different request
//     layer: LAYER;
//     // indicates if this request is valid to be served;
//     valid: boolean;
//     // indicates if this request is being served
//     isServed: boolean;
//     // how much revenue this requet earned to the company
//     revenue: number;

//     static createRandom(subscribers: Subscriber[], producers: Producer[], count: number): VideoRequest[] {
//         const requests: VideoRequest[] = [];
//         const subscribersCopy = _.cloneDeep(subscribers);
//         // we cannot create more requests than number of subscribers
//         const maxNumberOfRequests = Math.min(count, subscribersCopy.length);
//         for (let i = 0; i < maxNumberOfRequests; i++) {
//             const randomSubscriber = Util.randomFromArray(subscribersCopy);
//             // each subscriber has only one request so we remove it from subsequent random selection
//             subscribersCopy.splice( subscribersCopy.indexOf(randomSubscriber,0) ,1);
//             const randomProducer = Util.randomFromArray(producers);
//             const randomVideoLayer = VideoRequest.randomVideoLayer();
    
//             const request: VideoRequest = {
//                 id: uuid.v4(),
//                 subscriber: randomSubscriber,
//                 producer: randomProducer,
//                 layer: randomVideoLayer,
//                 isServed: false,            
//                 revenue: 0,
//                 valid: true
//             };
    
//             switch (randomVideoLayer) {
//                 case LAYER.BASE_LAYER: {
//                     requests.push({...request, id: uuid.v4(), layer: LAYER.BASE_LAYER});
//                     break;                
//                 };                
//                 case LAYER.EL1: {
//                     requests.push({...request, id: uuid.v4(), layer: LAYER.BASE_LAYER});
//                     requests.push({...request, id: uuid.v4(), layer: LAYER.EL1});
//                     break;
//                 };                
//                 case LAYER.EL2: {
//                     requests.push({...request, id: uuid.v4(), layer: LAYER.BASE_LAYER});
//                     requests.push({...request, id: uuid.v4(), layer: LAYER.EL1});
//                     requests.push({...request, id: uuid.v4(), layer: LAYER.EL2});
//                     break;
//                 };                         
//             }        
//         }
//         return requests;
//     };

//     private static randomVideoLayer(): LAYER {
//         return Util.randomEnum(LAYER);
//     }
// }