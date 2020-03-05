// import _ from 'lodash';
// import { EdgeLabel } from "../model/edgeLabel";
// import { Util } from '../utils/graphlibLabels';
// import { Network } from '../model/network';
// import { LAYER } from '../model/layer';

// export function lbs(network: Network): Network {
//     // deep copy to preserve the original network
//     const originalNetwork = _.cloneDeep(network);

//     // sort requests by layer
//     network.requests = _.orderBy(network.requests, ['layer'], ['asc']);

//     network.requests.forEach(request => {
//         // if request isn't valid or already served, skip it
//         if (!request.valid || request.isServed) return;

//         // P holds all possible paths
//         const P = [];

//         // remove edges that don't meet the bandwidth requiremnt
//         const H = _.cloneDeep(network.graph);
//         H.edges().forEach(edge => {
//             const edgeLabel = H.edge(edge) as any as EdgeLabel;
//             const requestBw = request.producer.bw[LAYER[request.layer]];
//             if (edgeLabel.bw < requestBw) {
//                 H.removeEdge(edge);
//             }
//         })

//         // get all nodes that are part of (producer,layer)
//         const scki = H.nodes().filter(node => {
//             const nodeLabel = Util.getNodeLabel(H, node);
                        
//             const requestInNodeThatMatchCurrentRequest = nodeLabel.requests.find((nodeRequest => {
//                 if (nodeRequest.id === request.id) return true;
//                 return false;
//             }));
            
//             if ( requestInNodeThatMatchCurrentRequest ) return true;
//             return false;
//         });

//         console.log(scki);
//     })
//     return originalNetwork;
// }
