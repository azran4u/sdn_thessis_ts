import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Scenario2 } from "../simulation";
import { WebServer } from "../web";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("alg", async () => {
  before(function () {});
  after(async function () {});
  beforeEach(async function () {});
  afterEach(async function () {});
  it("lbs", async () => {
    const scenario = new Scenario2();
    await scenario.start();
    const server = new WebServer(scenario.getStore());
    server.run();
  });
});
