import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { dbInstance as db, DatabaseConnector, NetworkNodeDal, GlobalDal } from '../database';
import { NetworkEdgeDal } from '../database/networkEdgeDal';
import logger from '../utils/logger';
import { config } from '../config';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('network node DAL', async () => {
  before(function () {
    logger.info(JSON.stringify(config.postgres));
  })
  after(async function () {
    await DatabaseConnector.getInstance().disconnect();
  });
  beforeEach(async function () {
    await GlobalDal.deleteAllDbContent();
  });
  afterEach(async function () {
  });
  it('object to coulmns names', async () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = DatabaseConnector.sqlCoulmnsNames(obj);
    expect(result).to.be.equal('a,b,c');
  });
  it('add three nodes and read all nodes', async () => {
    await NetworkNodeDal.insert({ text: 'a' });
    await NetworkNodeDal.insert({ text: 'b' });
    await NetworkNodeDal.insert({ text: 'c' });
    const nodes = await NetworkNodeDal.getAll();
    expect(nodes.length).to.be.equal(3);
  });
  it('add two nodes and read only one of them', async () => {
    await NetworkNodeDal.insert({ text: 'a' });
    await NetworkNodeDal.insert({ text: 'b' });
    const nodes = await NetworkNodeDal.getManyByText(['a', 'b']);
    expect(nodes.length).to.be.equal(2);
  });
  it('get two nodes and read only one - pass non existent node_name to getByNames', async () => {
    await NetworkNodeDal.insert({ text: 'a' });
    await NetworkNodeDal.insert({ text: 'b' });
    const nodes = await NetworkNodeDal.getManyByText(['a', 'c']);
    expect(nodes.length).to.be.equal(1);
  });
  it('add edge and read it', async () => {
    const node1 = await NetworkNodeDal.insertAndRead({ text: 'a' });
    const node2 = await NetworkNodeDal.insertAndRead({ text: 'b' });
    await NetworkEdgeDal.insert({
      bw: 1,
      jitter: 1,
      latency: 1,
      from_node: node1.id,
      to_node: node2.id
    });
    const edges = await NetworkEdgeDal.getAll();
    expect(edges.length).to.be.equal(1);
  });
  it('couldnt add two edges between the same nodes', async () => {
    const node1 = await NetworkNodeDal.insertAndRead({ text: 'a' });
    const node2 = await NetworkNodeDal.insertAndRead({ text: 'b' });
    await NetworkEdgeDal.insert({
      bw: 1,
      jitter: 1,
      latency: 1,
      from_node: node1.id,
      to_node: node2.id
    });
    await NetworkEdgeDal.insert({
      bw: 1,
      jitter: 1,
      latency: 1,
      from_node: node1.id,
      to_node: node2.id
    });
    const edges = await NetworkEdgeDal.getAll();
    expect(edges.length).to.be.equal(1);
  });
  it('add multiple edges and read some of them', async () => {
    const node1 = await NetworkNodeDal.insertAndRead({ text: 'a' });
    const node2 = await NetworkNodeDal.insertAndRead({ text: 'b' });
    const node3 = await NetworkNodeDal.insertAndRead({ text: 'c' });
    const edge1 = await NetworkEdgeDal.insert({
      bw: 1,
      jitter: 1,
      latency: 1,
      from_node: node1.id,
      to_node: node2.id
    });
    const edge2 = await NetworkEdgeDal.insert({
      bw: 1,
      jitter: 1,
      latency: 1,
      from_node: node1.id,
      to_node: node3.id
    });
    const edge3 = await NetworkEdgeDal.insert({
      bw: 1,
      jitter: 1,
      latency: 1,
      from_node: node2.id,
      to_node: node3.id
    });
    const edge = await NetworkEdgeDal.getOneByFromTo(node2.id, node3.id);
    expect(edge.id).to.be.exist;
  });
  it('read non existent edge', async () => {
    const edge = await NetworkEdgeDal.getOneByFromTo(1, 1);
    expect(edge).to.be.undefined;
  });
  it('insert and read edge', async () => {
    const node1 = await NetworkNodeDal.insertAndRead({ text: 'a' });
    const node2 = await NetworkNodeDal.insertAndRead({ text: 'b' });
    const edge1 = await NetworkEdgeDal.insertAndRead({
      bw: 1,
      jitter: 1,
      latency: 1,
      from_node: node1.id,
      to_node: node2.id
    });
    expect(edge1.id).to.be.exist;
  });
});