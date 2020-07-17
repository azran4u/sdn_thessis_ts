import { Store } from "../store";

export interface d3GraphNode {
    id: string;
    group: number;
}

export interface d3GraphLink {
    source: string;
    target: string;
    value: number
}

export interface d3GraphDataModel {
    nodes: d3GraphNode[],
    links: d3GraphLink[]
}

export class D3Formatter {
    constructor(private store: Store) {
        this.store = store;
    }

    getData(): d3GraphDataModel {
        const nodes = this.store.allNodes();
        const edges = this.store.allEdges();
        return {
            nodes: nodes.map(node => {
                return {
                    id: node.id,
                    group: 1
                }
            }),
            links: edges.map(edge => {
                return {
                    source: edge.from_node,
                    target: edge.to_node,
                    value: edge.latency
                }
            })
        };
    }
}