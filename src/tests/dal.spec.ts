import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { config } from '../config';
import { DatabaseConnector, NetworkNodeDal, GlobalDal } from '../database';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('network node DAL', async () => {  
  beforeEach(async function () {
    await DatabaseConnector.getInstance(config.postgres);
    await GlobalDal.deleteAllDbContent();
  });
  afterEach(async function () {
    await DatabaseConnector.getInstance().disconnect();    
  });
  it('add three nodes and read all nodes', async () => {
    await NetworkNodeDal.insertNetworkNode('a');
    await NetworkNodeDal.insertNetworkNode('b');
    await NetworkNodeDal.insertNetworkNode('c');
    const nodes = await NetworkNodeDal.getAllNetworkNode();
    expect(nodes.length).to.be.equal(3);
  });
  it('add two nodes and read only them', async () => {
    await NetworkNodeDal.insertNetworkNode('a');
    await NetworkNodeDal.insertNetworkNode('b');
    const nodes = await NetworkNodeDal.getByNames(['a', 'b']);    
    expect(nodes.length).to.be.equal(2);
  });
  it('get two nodes and read only one - pass non existent node_name to getByNames', async () => {
    await NetworkNodeDal.insertNetworkNode('a');
    await NetworkNodeDal.insertNetworkNode('b');
    const nodes = await NetworkNodeDal.getByNames(['a', 'c']);    
    expect(nodes.length).to.be.equal(1);
  });
});