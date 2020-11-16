import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Scenario4x4 } from "../simulation";
import { WebServer } from "../web";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("alg", async () => {
  before(function () {});
  after(async function () {});
  beforeEach(async function () {});
  afterEach(async function () {});
  it.only("4x4", async () => {
    const scenario = new Scenario4x4();
    await scenario.start();
    // const server = new WebServer(scenario.getStore());
    // await server.run();
  });
});
