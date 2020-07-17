// import * as chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// import { dbInstance as db, DatabaseConnector } from '../database';
// import { NetworkNodeDal, GlobalDal, VideoRequestResultDal } from '../dal';
// import { NetworkEdgeDal } from '../dal/networkEdgeDal';
// import logger from '../utils/logger';
// import { config } from '../config';
// import { ProducerDal } from '../dal/producerDal';
// import { SubscriberDal } from '../dal/subscriberDal';
// import { VideoRequestDal } from '../dal/videoRequestsDal';
// import { LAYER, ALGORITHM, VIDEO_REQUEST_STATUS } from '../model/model';
// import { VideoRequestResultEdgesDal } from '../dal/videoRequestResultEdges';
// import { lbs } from '../algorithms/lbs';
// import { NetworkGraph } from '../graph/networkGraph';

// chai.use(chaiAsPromised);
// const expect = chai.expect;

// describe('tests', async () => {
//   before(function () {
//     logger.info(JSON.stringify(config.postgres));
//   })
//   after(async function () {
//     await DatabaseConnector.getInstance().disconnect();
//     logger.info(`database disconneted`);
//   });
//   beforeEach(async function () {
//     await GlobalDal.deleteAllDbContent();
//   });
//   afterEach(async function () {
//   });
//   it('database time', async () => {
//     const time = await GlobalDal.getDatabaseTime();
//     expect(time).to.be.exist;
//   });
//   it('object to coulmns names', async () => {
//     const obj = { a: 1, b: 2, c: 3 };
//     const result = DatabaseConnector.sqlCoulmnsNames(obj);
//     expect(result).to.be.equal('a,b,c');
//   });
//   it('add three nodes and read all nodes', async () => {
//     await NetworkNodeDal.insertAndRead();
//     await NetworkNodeDal.insertAndRead();
//     await NetworkNodeDal.insertAndRead();
//     const nodes = await NetworkNodeDal.getAll();
//     expect(nodes.length).to.be.equal(3);
//   });
//   it('add edge and read it', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     await NetworkEdgeDal.insert({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node2.id
//     });
//     const edges = await NetworkEdgeDal.getAll();
//     expect(edges.length).to.be.equal(1);
//   });
//   it('couldnt add two edges between the same nodes', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     await NetworkEdgeDal.insert({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node2.id
//     });
//     try {
//       await NetworkEdgeDal.insert({
//         bw: 1,
//         jitter: 1,
//         latency: 1,
//         from_node: node1.id,
//         to_node: node2.id
//       });
//     } catch (e) {
//       expect(e).to.be.exist;
//     }
//   });
//   it('add multiple edges and read some of them', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     const node3 = await NetworkNodeDal.insertAndRead();
//     const edge1 = await NetworkEdgeDal.insert({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node2.id
//     });
//     const edge2 = await NetworkEdgeDal.insert({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node3.id
//     });
//     const edge3 = await NetworkEdgeDal.insert({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node2.id,
//       to_node: node3.id
//     });
//     const edge = await NetworkEdgeDal.getOneByFromTo(node2.id, node3.id);
//     expect(edge.id).to.be.exist;
//   });
//   it('read non existent edge', async () => {
//     const edge = await NetworkEdgeDal.getOneByFromTo(1, 1);
//     expect(edge).to.be.undefined;
//   });
//   it('insert and read edge', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     const edge1 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node2.id
//     });
//     expect(edge1.id).to.be.exist;
//   });
//   it('insert and read single producer', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const producer = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     expect(producer.id).to.be.exist;
//   });
//   it('insert multiple producers and read all', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     const node3 = await NetworkNodeDal.insertAndRead();
//     const producer1 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const producer2 = await ProducerDal.insertAndRead({
//       node: node2.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const producer3 = await ProducerDal.insertAndRead({
//       node: node3.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const producers = await ProducerDal.getAll();
//     expect(producers.length).to.be.equal(3);
//   });
//   it('add multiple producers to the same node', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const producer1 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const producer2 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const producer3 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const producers = await ProducerDal.getAll();
//     expect(producers.length).to.be.equal(3);
//   });
//   it('add one subscriber and read it back', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const subscriber1 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'BRONZE'
//     });
//     expect(subscriber1.id).to.be.exist;
//   });
//   it('add multiple subscribers and read them all', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     const node3 = await NetworkNodeDal.insertAndRead();
//     const subscriber1 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'GOLD'
//     });
//     const subscriber2 = await SubscriberDal.insertAndRead({
//       node: node2.id,
//       priority: 'SILVER'
//     });
//     const subscriber3 = await SubscriberDal.insertAndRead({
//       node: node3.id,
//       priority: 'BRONZE'
//     });
//     const subscribers = await SubscriberDal.getAll();
//     expect(subscribers.length).to.be.equal(3);
//   });
//   it('add multiple subscribers to the same node', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const subscriber1 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'GOLD'
//     });
//     const subscriber2 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'SILVER'
//     });
//     const subscriber3 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'BRONZE'
//     });
//     const subscribers = await SubscriberDal.getAll();
//     expect(subscribers.length).to.be.equal(3);
//   });
//   it('add single video request and read it', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();

//     const producer1 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });

//     const subscriber1 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'BRONZE'
//     });

//     const videoRequest1 = await VideoRequestDal.insertAndRead({
//       producer: producer1.id,
//       subscriber: subscriber1.id,
//       layer: "BASE"
//     });

//     const videoRequest = await VideoRequestDal.getOne({
//       producer: videoRequest1.producer,
//       subscriber: videoRequest1.subscriber,
//       layer: videoRequest1.layer
//     });

//     expect(videoRequest.id).to.be.exist;
//   });
//   it('add multiple video requests and read them all', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     const node3 = await NetworkNodeDal.insertAndRead();
//     const producer1 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const producer2 = await ProducerDal.insertAndRead({
//       node: node2.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const producer3 = await ProducerDal.insertAndRead({
//       node: node3.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });
//     const subscriber1 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'GOLD'
//     });
//     const subscriber2 = await SubscriberDal.insertAndRead({
//       node: node2.id,
//       priority: 'SILVER'
//     });
//     const subscriber3 = await SubscriberDal.insertAndRead({
//       node: node3.id,
//       priority: 'BRONZE'
//     });
//     const videoRequest1 = await VideoRequestDal.insert({
//       producer: producer1.id,
//       subscriber: subscriber1.id,
//       layer: "BASE"
//     });
//     const videoRequest2 = await VideoRequestDal.insert({
//       producer: producer2.id,
//       subscriber: subscriber2.id,
//       layer: "EL1"
//     });
//     const videoRequest3 = await VideoRequestDal.insert({
//       producer: producer3.id,
//       subscriber: subscriber3.id,
//       layer: "EL2"
//     });
//     const videoRequests = await VideoRequestDal.getAll();
//     expect(videoRequests.length).to.be.equal(3);
//   });
//   it('add single video request result and read it', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();

//     const producer1 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });

//     const subscriber1 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'BRONZE'
//     });

//     const videoRequest1 = await VideoRequestDal.insertAndRead({
//       producer: producer1.id,
//       subscriber: subscriber1.id,
//       layer: "BASE"
//     });

//     const videoRequestResult1 = await VideoRequestResultDal.insertAndRead({
//       alogorithm: ALGORITHM.LBS,
//       videoRequest: videoRequest1.id,
//       status: VIDEO_REQUEST_STATUS.PENDING,
//       e2e_hopCount: 1,
//       e2e_jitter: 1,
//       e2e_latency: 1
//     });

//     expect(videoRequestResult1.id).to.be.exist;
//   });
//   it('add single video request edge result and read it', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     const node3 = await NetworkNodeDal.insertAndRead();

//     const edge1 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node2.id
//     });

//     const edge2 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node3.id
//     });

//     const producer1 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });

//     const subscriber1 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'BRONZE'
//     });

//     const videoRequest1 = await VideoRequestDal.insertAndRead({
//       producer: producer1.id,
//       subscriber: subscriber1.id,
//       layer: "BASE"
//     });

//     const videoRequestResult1 = await VideoRequestResultDal.insertAndRead({
//       alogorithm: ALGORITHM.LBS,
//       videoRequest: videoRequest1.id,
//       status: VIDEO_REQUEST_STATUS.PENDING,
//       e2e_hopCount: 1,
//       e2e_jitter: 1,
//       e2e_latency: 1
//     });

//     const videoRequestResultEdge1 = await VideoRequestResultEdgesDal.insertAndRead({
//       videoRequestResult: videoRequestResult1.id,
//       edge: edge1.id
//     });
//     expect(videoRequestResultEdge1.id).to.be.exist;

//     // create another one - expect to fail
//     const videoRequestResultEdge11 = await VideoRequestResultEdgesDal.insertAndRead({
//       videoRequestResult: videoRequestResult1.id,
//       edge: edge1.id
//     });
//     expect(videoRequestResultEdge11).to.be.undefined;

//     const videoRequestResultEdge2 = await VideoRequestResultEdgesDal.insertAndRead({
//       videoRequestResult: videoRequestResult1.id,
//       edge: edge2.id
//     });
//     expect(videoRequestResultEdge2.id).to.be.exist;
//   });
//   it('lbs correctness', async () => {
//     const node1 = await NetworkNodeDal.insertAndRead();
//     const node2 = await NetworkNodeDal.insertAndRead();
//     const node3 = await NetworkNodeDal.insertAndRead();

//     const edge1 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node2.id
//     });

//     const edge2 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node2.id,
//       to_node: node1.id
//     });

//     const edge3 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node2.id,
//       to_node: node3.id
//     });

//     const edge4 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node3.id,
//       to_node: node2.id
//     });

//     const edge5 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node3.id,
//       to_node: node1.id
//     });

//     const edge6 = await NetworkEdgeDal.insertAndRead({
//       bw: 1,
//       jitter: 1,
//       latency: 1,
//       from_node: node1.id,
//       to_node: node3.id
//     });

//     const producer1 = await ProducerDal.insertAndRead({
//       node: node1.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });

//     const producer2 = await ProducerDal.insertAndRead({
//       node: node2.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });

//     const producer3 = await ProducerDal.insertAndRead({
//       node: node3.id,
//       base_layer_bw: 1,
//       enhancement_layer_1_bw: 1,
//       enhancement_layer_2_bw: 1
//     });

//     const subscriber1 = await SubscriberDal.insertAndRead({
//       node: node1.id,
//       priority: 'GOLD'
//     });

//     const subscriber2 = await SubscriberDal.insertAndRead({
//       node: node2.id,
//       priority: 'SILVER'
//     });

//     const subscriber3 = await SubscriberDal.insertAndRead({
//       node: node3.id,
//       priority: 'BRONZE'
//     });

//     const videoRequest1 = await VideoRequestDal.insertAndRead({
//       producer: producer1.id,
//       subscriber: subscriber2.id,
//       layer: "BASE"
//     });

//     const videoRequest2 = await VideoRequestDal.insertAndRead({
//       producer: producer1.id,
//       subscriber: subscriber2.id,
//       layer: "EL1"
//     });

//     const videoRequest3 = await VideoRequestDal.insertAndRead({
//       producer: producer1.id,
//       subscriber: subscriber2.id,
//       layer: "EL2"
//     });

//     const g = await NetworkGraph.build();
//     const results = lbs({
//       graph: g,
//       producers: [producer1, producer2, producer3],
//       subscribers: [subscriber1, subscriber2, subscriber3],
//       requests: [videoRequest1, videoRequest2, videoRequest3]
//     });
//   });
// });