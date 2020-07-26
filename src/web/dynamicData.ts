import { Store } from "../store";
import { NetworkNode, NetworkEdge } from "../model";
import { treeToNetworkNodesAndEdges } from "../graph/networkGraph";

export interface d3GraphNode {
    name: string;
    group: number;
}

export interface d3GraphLink {
    source: number;
    target: number;
    value: number
}

export interface d3GraphDataModel {
    nodes: d3GraphNode[],
    edges: d3GraphLink[]
}

export class D3Formatter {

    constructor(private store: Store) {

    }

    convertToD3Model(nodes: NetworkNode[], edges: NetworkEdge[]): d3GraphDataModel {
        const nodesRes = nodes.map(node => {
            return {
                name: node.id,
                group: 1
            }
        });
        const edgesRes = edges.map(edge => {
            return {
                source: nodesRes.findIndex(node => { return node.name === edge.from_node }),
                target: nodesRes.findIndex(node => { return node.name === edge.to_node }),
                value: edge.latency
            }
        });
        return {
            nodes: nodesRes,
            edges: edgesRes
        };
    }
    getData() {
        const graphs: d3GraphDataModel[] = [];
        graphs.push(this.convertToD3Model(this.store.allNodes(), this.store.allEdges()));
        this.store.getContentTrees().forEach( (tree, key, map) => {
            const { nodes, edges } = treeToNetworkNodesAndEdges(tree);
            graphs.push(this.convertToD3Model(nodes, edges));
        })
        return {
            data: graphs
        }
    }
}