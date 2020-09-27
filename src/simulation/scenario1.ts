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
        this.networkGenerator = new ThreeNodeNetwork(this.store);
        this.algo = new LBS({
            max_delay: 10,
            max_jitter: 3
        });
    }

    getStore() {
        return this.store;
    }
    start() {
        this.network = this.networkGenerator.generate();
        const res = this.algo.run(this.network);
        this.store.setContentTrees(res.contentTrees);
    }
}



