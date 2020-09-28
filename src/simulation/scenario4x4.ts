import { LBS } from "../algorithms";
import { Scenario, NetworkGraph, Algorithm } from "../model";
import { Store, StoreSerializer } from "../store";
import { Grid4x4Network } from "./grid-network";
import { SimulationUtil } from "./simulationUtil";

export class Scenario4x4 implements Scenario {
  private store: Store;
  private network: NetworkGraph;
  private algo: Algorithm;

  constructor() {}

  getStore() {
    return this.store;
  }

  async start() {
    await this.subtask(8);
    await this.subtask(10);
    await this.subtask(12);
    await this.subtask(14);
    await this.subtask(16);
  }
  private async subtask(numberOfRequests: number) {
    this.store = new Store();
    this.network = new Grid4x4Network(this.store, numberOfRequests).generate();
    this.algo = new LBS({
      max_delay: 10,
      max_jitter: 3,
    });
    const res = this.algo.run(this.network);
    this.store.setContentTrees(res.contentTrees);
    res.videoRequestResult.forEach((result) => {
      this.store.addVideoRequestResult(result);
    });
    this.store.setRevenue(res.revenue);
    this.store.setDuration(res.duration);
    StoreSerializer.saveToFile(
      this.store,
      `src/simulation/results/grid4x4-lbs-${numberOfRequests}-requests.json`
    );
    await SimulationUtil.printResultsToCSV(this.store);
  }
}
