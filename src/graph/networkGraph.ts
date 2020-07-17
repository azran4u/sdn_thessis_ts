import * as graphlib from 'graphlib';
// import { NetworkEdgeDal, NetworkNodeDal } from '../dal';
import { NetworkNode, NetworkEdge } from '../model';

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

// export class NetworkGraph {
//     public static async build(): Promise<graphlib.Graph> {
//         const nodes = await NetworkNodeDal.getAll();
//         const edges = await NetworkEdgeDal.getAll();

//         const g = new graphlib.Graph({
//             directed: true,
//             multigraph: false,
//             compound: false
//         });

//         nodes.forEach(node => {
//             g.setNode(node.id.toString(), node);
//         });

//         edges.forEach(edge => {
//             const from = nodes.find(node => node.id === edge.from_node);
//             const to = nodes.find(node => node.id === edge.to_node);
//             g.setEdge(from.id.toString(), to.id.toString(), edge);
//         })

//         return g;
//     }
// }