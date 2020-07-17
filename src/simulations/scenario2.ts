// import { Simulation } from "../simulation/simulation";
// import { SimulationResults } from "../simulation/simulationResults";
// import { NetworkNodeDal, NetworkEdgeDal, ProducerDal, SubscriberDal, VideoRequestDal, GlobalDal } from "../dal";
// import { Random } from "../utils/random";
// import { config } from "../config";
// import logger from "../utils/logger";
// import { LAYER } from "../model/model";
// // import { NetworkGraph } from "../graph/networkGraph";
// import { lbs } from "../algorithms/lbs";
// import { Scenario } from "./scenario";


// export class Scenario2 implements Scenario {
//     start() {
//         throw new Error("Method not implemented.");
//     }
    
//     static async start() {
//         await Scenario2.buildNetwork();
//         const g = await NetworkGraph.build();
//         const producers = await ProducerDal.getAll();
//         const subscribers = await SubscriberDal.getAll();
//         const requests = await VideoRequestDal.getAll();
//         const a = lbs({
//             graph: g,
//             producers: producers,
//             subscribers: subscribers,
//             requests: requests
//         });
//     }

//     private static async buildNetwork() {

//         await GlobalDal.deleteAllDbContent();

//         const node1 = await NetworkNodeDal.insertAndRead();
//         const node2 = await NetworkNodeDal.insertAndRead();
//         const node3 = await NetworkNodeDal.insertAndRead();

//         const edge1 = await NetworkEdgeDal.insertAndRead({
//             from_node: node1.id,
//             to_node: node2.id,
//             bw: Random.randomIntFromInterval(config.edge.bw),
//             jitter: Random.randomIntFromInterval(config.edge.jitter),
//             latency: Random.randomIntFromInterval(config.edge.latency),
//         });

//         const edge11 = await NetworkEdgeDal.insertAndRead({
//             from_node: node1.id,
//             to_node: node2.id,
//             bw: Random.randomIntFromInterval(config.edge.bw),
//             jitter: Random.randomIntFromInterval(config.edge.jitter),
//             latency: Random.randomIntFromInterval(config.edge.latency),
//         });

//         const edge2 = await NetworkEdgeDal.insertAndRead({
//             from_node: node1.id,
//             to_node: node3.id,
//             bw: Random.randomIntFromInterval(config.edge.bw),
//             jitter: Random.randomIntFromInterval(config.edge.jitter),
//             latency: Random.randomIntFromInterval(config.edge.latency),
//         });

//         const edge3 = await NetworkEdgeDal.insertAndRead({
//             from_node: node2.id,
//             to_node: node3.id,
//             bw: Random.randomIntFromInterval(config.edge.bw),
//             jitter: Random.randomIntFromInterval(config.edge.jitter),
//             latency: Random.randomIntFromInterval(config.edge.latency),
//         });

//         const edge4 = await NetworkEdgeDal.insertAndRead({
//             from_node: node2.id,
//             to_node: node1.id,
//             bw: Random.randomIntFromInterval(config.edge.bw),
//             jitter: Random.randomIntFromInterval(config.edge.jitter),
//             latency: Random.randomIntFromInterval(config.edge.latency),
//         });

//         const edge5 = await NetworkEdgeDal.insertAndRead({
//             from_node: node3.id,
//             to_node: node1.id,
//             bw: Random.randomIntFromInterval(config.edge.bw),
//             jitter: Random.randomIntFromInterval(config.edge.jitter),
//             latency: Random.randomIntFromInterval(config.edge.latency),
//         });

//         const edge6 = await NetworkEdgeDal.insertAndRead({
//             from_node: node3.id,
//             to_node: node2.id,
//             bw: Random.randomIntFromInterval(config.edge.bw),
//             jitter: Random.randomIntFromInterval(config.edge.jitter),
//             latency: Random.randomIntFromInterval(config.edge.latency),
//         });

//         const producer1 = await ProducerDal.insertAndRead({
//             node: node1.id,
//             base_layer_bw: Random.randomIntFromInterval(config.producer.base_layer_bw),
//             enhancement_layer_1_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_1_bw),
//             enhancement_layer_2_bw: Random.randomIntFromInterval(config.producer.enhancement_layer_2_bw)
//         });

//         const subscriber1 = await SubscriberDal.insertAndRead({
//             node: node2.id,
//             priority: 'GOLD'
//         });

//         const videoRequest1 = await VideoRequestDal.insertAndRead({
//             producer: producer1.id,
//             subscriber: subscriber1.id,
//             layer: Random.layer()
//         });
//     };
// }



