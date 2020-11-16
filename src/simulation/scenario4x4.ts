import { LBS } from "../algorithms";
import { LLVS } from "../algorithms/llvs";
import { Scenario } from "../model";
import { Store, StoreSerializer } from "../store";
import { Grid4x4Network } from "./grid-network";
import { SimulationUtil } from "./simulationUtil";

export class Scenario4x4 implements Scenario {
  constructor() {}

  async start() {
    await this.lbsRun(8);
    await this.lbsRun(10);
    await this.lbsRun(12);
    await this.lbsRun(14);
    await this.lbsRun(16);

    await this.llvsRun(8);
    await this.llvsRun(10);
    await this.llvsRun(12);
    await this.llvsRun(14);
    await this.llvsRun(16);
  }
  private async lbsRun(numberOfRequests: number) {
    const store = new Store();
    const network = new Grid4x4Network(store, numberOfRequests).generate();
    const algo = new LBS({
      max_delay: 10,
      max_jitter: 3,
      w: [8, 1, 0],
    });
    const algoRes = algo.run(network);
    store.setContentTrees(algoRes.contentTrees);
    algoRes.videoRequestResult.forEach((result) => {
      store.addVideoRequestResult(result);
    });
    store.setRevenue(algoRes.revenue);
    store.setDuration(algoRes.duration);
    StoreSerializer.saveToFile(
      store,
      `src/simulation/results/grid4x4-lbs-${numberOfRequests}-requests.json`
    );
    await SimulationUtil.printResultsToCSV(store);
  }

  private async llvsRun(numberOfRequests: number) {
    const store = new Store();
    const network = new Grid4x4Network(store, numberOfRequests).generate();
    const algo = new LLVS({
      max_delay: 10,
      max_jitter: 3,
      input: network,
      w: [8, 1, 0, 0, 0, 0, 0, 0, 0],
    });
    const algoRes = algo.run();
    store.setContentTrees(algoRes.contentTrees);
    algoRes.videoRequestResult.forEach((result) => {
      store.addVideoRequestResult(result);
    });
    store.setRevenue(algoRes.revenue);
    store.setDuration(algoRes.duration);
    StoreSerializer.saveToFile(
      store,
      `src/simulation/results/grid4x4-llvs-${numberOfRequests}-requests.json`
    );
    debugger;
    await SimulationUtil.printResultsToCSV(store);
  }
}
