import * as graphlib from 'graphlib';
// import { NetworkEdgeDal, NetworkNodeDal } from '../dal';
import { NetworkNode, NetworkEdge } from '../model';

export interface NetworkNodesAndEdges {
    nodes: NetworkNode[],
    edges: NetworkEdge[]
}

export function buildNetwork(nodes: NetworkNode[], edges: NetworkEdge[]): graphlib.Graph {
    const g = new graphlib.Graph({
        directed: true,
        multigraph: false,
        compound: false
    });

    nodes.forEach(node => {
        g.setNode(node.id.toString(), node);
    });

    edges.forEach(edge => {
        const from = nodes.find(node => node.id === edge.from_node);
        const to = nodes.find(node => node.id === edge.to_node);
        g.setEdge(from.id, to.id, edge);
    })

    return g;
}

export function treeToNetworkNodesAndEdges(tree: graphlib.Graph): NetworkNodesAndEdges {
    const nodes = tree.nodes().map(node => {
        return tree.node(node) as NetworkNode
    });
    const edges = tree.edges().map(edge => {
        return tree.edge(edge) as NetworkEdge
    });
    return {
        nodes: nodes,
        edges: edges
    }
}