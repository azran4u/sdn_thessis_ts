import { LBS } from "../algorithms";
import { Scenario, NetworkGraph, NetworkGenerator, Algorithm } from "../model";
import { Store } from "../store";
import { ThreeNodeNetwork } from "./three-node-network";

export class Scenario1 implements Scenario {
    private store: Store;
    private networkGenerator: NetworkGenerator;
    private network: NetworkGraph;
    private algo: Algorithm;

    constructor() {
        this.store = new Store;
        this.networkGenerator = new ThreeNodeNetwork();
        this.algo = new LBS();
    }

    getStore() {
        return this.store;
    }
    start() {
        this.network = this.networkGenerator.generate(this.store);
        const res = this.algo.run(this.network);
        this.store.setContentTrees(res.contentTrees);
    }
}



