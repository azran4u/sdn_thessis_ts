import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { buildNetwork } from "../graph/networkGraph";
import { ContentTreeNetworkNode, NetworkEdge } from "../model";
import { GraphUtil } from "./utils";
import * as graphlib from "graphlib";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe.only("mergePathIntoTree", async () => {
  function buildEdge(id: string, from: string, to: string): NetworkEdge {
    return {
      from_node: from,
      to_node: to,
      bw: 1,
      id: id,
      jitter: 1,
      latency: 1,
    };
  }
  it("empty edges and empty G", async () => {
    const G = buildNetwork([], []);
    const H = GraphUtil.mergePathIntoTree([], G);
    expect(H).to.deep.equal(G);
  });
  it("empty G", async () => {
    const G = buildNetwork([], []);
    const expected = buildNetwork(
      [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
      [
        buildEdge("e1", "a", "b"),
        buildEdge("e2", "b", "c"),
        buildEdge("e3", "c", "d"),
      ]
    );
    const H = GraphUtil.mergePathIntoTree(
      [
        buildEdge("e1", "a", "b"),
        buildEdge("e2", "b", "c"),
        buildEdge("e3", "c", "d"),
      ],
      G
    );
    expect(H.nodes()).to.deep.equal(expected.nodes());
    expect(H.edges()).to.deep.equal(expected.edges());
  });
  it("empty edges", async () => {
    const G = buildNetwork(
      [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
      [
        buildEdge("e1", "a", "b"),
        buildEdge("e2", "b", "c"),
        buildEdge("e3", "c", "d"),
      ]
    );
    const H = GraphUtil.mergePathIntoTree([], G);
    expect(H).to.deep.equal(G);
  });
  it("edges continue G", async () => {
    const G = buildNetwork(
      [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
      [
        buildEdge("e1", "a", "b"),
        buildEdge("e2", "b", "c"),
        buildEdge("e3", "c", "d"),
      ]
    );
    const H = GraphUtil.mergePathIntoTree(
      [
        buildEdge("e4", "d", "e"),
        buildEdge("e5", "e", "f"),
        buildEdge("e6", "f", "g"),
      ],
      G
    );
    const expected = buildNetwork(
      [
        { id: "a" },
        { id: "b" },
        { id: "c" },
        { id: "d" },
        { id: "e" },
        { id: "f" },
        { id: "g" },
      ],
      [
        buildEdge("e1", "a", "b"),
        buildEdge("e2", "b", "c"),
        buildEdge("e3", "c", "d"),
        buildEdge("e4", "d", "e"),
        buildEdge("e5", "e", "f"),
        buildEdge("e6", "f", "g"),
      ]
    );
    expect(H.nodes()).to.deep.equal(expected.nodes());
    expect(H.edges()).to.deep.equal(expected.edges());
  });
  it("edges overlap G", async () => {
    const G = new graphlib.Graph({
      directed: true,
      multigraph: false, // tree isn't multigraph
      compound: false,
    });
    G.setNode("a", {
      id: "a",
      e2e_hopCount: 1,
      e2e_jitter: 1,
      e2e_latency: 1,
    } as ContentTreeNetworkNode);
    G.setNode("b", {
      id: "b",
      e2e_hopCount: 2,
      e2e_jitter: 2,
      e2e_latency: 2,
    } as ContentTreeNetworkNode);
    G.setNode("c", {
      id: "c",
      e2e_hopCount: 3,
      e2e_jitter: 3,
      e2e_latency: 3,
    } as ContentTreeNetworkNode);
    G.setNode("d", {
      id: "d",
      e2e_hopCount: 4,
      e2e_jitter: 4,
      e2e_latency: 4,
    } as ContentTreeNetworkNode);
    const expected = G;
    expected.setEdge("a", "b");
    expected.setEdge("b", "c");
    expected.setEdge("c", "d");
    expected.setEdge("d", "e");
    const H = GraphUtil.mergePathIntoTree(
      [
        buildEdge("e4", "b", "c"),
        buildEdge("e5", "c", "d"),
        buildEdge("e6", "d", "e"),
      ],
      G
    );
    expect(H.nodes()).to.deep.equal(expected.nodes());
    expect(H.edges()).to.deep.equal(expected.edges());
  });
});
