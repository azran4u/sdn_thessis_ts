import { LBS } from "../algorithms";
import { Scenario, NetworkGraph, NetworkGenerator, Algorithm } from "../model";
import { Store } from "../store";
import { Grid4x4Network } from "./grid-network";
import { SimulationUtil } from "./simulationUtil";

export class Scenario2 implements Scenario {
  private store: Store;
  private networkGenerator: NetworkGenerator;
  private network: NetworkGraph;
  private algo: Algorithm;

  constructor() {
    this.store = new Store();
    this.networkGenerator = new Grid4x4Network(this.store);
    this.algo = new LBS({
        max_delay: 4,
        max_jitter: 3
    });
  }

  getStore() {
    return this.store;
  }

  async start() {
    this.network = this.networkGenerator.generate();
    const res = this.algo.run(this.network);
    this.store.setContentTrees(res.contentTrees);
    res.videoRequestResult.forEach((result) => {
      this.store.addVideoRequestResult(result);
    });
    await SimulationUtil.printResultsToCSV(this.store);
  }
}
