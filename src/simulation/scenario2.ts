import { LBS } from "../algorithms";
import { Scenario, NetworkGraph, NetworkGenerator, Algorithm } from "../model";
import { Store } from "../store";
import { GridNetwork } from "./grid-network";
import { createObjectCsvWriter } from 'csv-writer';
import { request } from "http";
import { SimulationUtil } from "./simulationUtil";

export class Scenario2 implements Scenario {
    private store: Store;
    private networkGenerator: NetworkGenerator;
    private network: NetworkGraph;
    private algo: Algorithm;

    constructor() {
        this.store = new Store;
        this.networkGenerator = new GridNetwork(this.store, 4);
        this.algo = new LBS();
    }

    getStore() {
        return this.store;
    }

    async start() {
        this.network = this.networkGenerator.generate();
        const res = this.algo.run(this.network);
        this.store.setContentTrees(res.contentTrees);
        res.videoRequestResult.forEach(result => {
            this.store.addVideoRequestResult(result);
        })
        await SimulationUtil.printResultsToCSV(this.store);
    }
}



