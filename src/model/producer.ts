// import { LAYERS_BW, config } from "../config";
// import uuid = require("uuid");
// import {Util} from '../utils/graphlibLabels'

// // producer is a video source with 3 layers
// export class Producer {
//     id: string;
//     bw: LAYERS_BW;

//     static createRandom(count: number): Producer[] {
//         const producers: Producer[] = [];
//         for (let i = 0; i < count; i++) {
//             producers.push({
//                 id: uuid.v4(),
//                 bw: {
//                     BASE_LAYER: Util.randomIntFromInterval(config.producer.bw.BASE_LAYER),
//                     EL1: Util.randomIntFromInterval(config.producer.bw.EL1),
//                     EL2: Util.randomIntFromInterval(config.producer.bw.EL2),
//                 }
//             })
//         }
//         return producers;
//     };
// }