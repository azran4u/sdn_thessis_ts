// import uuid = require("uuid");
// import { config } from "../config";
// // import { VideoRequest } from "./videoRequest";

// export class EdgeLabel {
//     id: string;
//     bw: number;
//     latency: number;
//     jitter: number;

//     // array of requests ids that use this edge
//     requests: VideoRequest[];

//     static createRandom(): EdgeLabel {
//         return {
//             id: uuid.v4(),
//             bw: Util.randomIntFromInterval(config.edge.bw),
//             jitter: Util.randomIntFromInterval(config.edge.jitter),
//             latency: Util.randomIntFromInterval(config.edge.latency),
//             requests: []
//         };
//     }
// }