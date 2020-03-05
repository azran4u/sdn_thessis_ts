// import * as graphlib from 'graphlib';
// import { Producer } from './producer';
// import { Util } from '../utils/graphlibLabels';
// import { Subscriber } from './subscriber';
// import { NetworkNode } from './networkNode';
// import { EdgeLabel } from './edgeLabel';
// import { ContentTree } from './tree';

// export class GraphHelperFunctions {
//     // static addSingleElementToGraph(graph: graphlib.Graph, node: string ,element: Producer | Subscriber): graphlib.Graph {

//     //     let label = Util.getNodeLabel(graph, node);
//     //     if( element instanceof Producer ) {
//     //         label.producers.push(element);
            
//     //     }
//     //     if( element instanceof Subscriber ) {
//     //         label.subscribers.push(element);
//     //     }
//     //     graph.setNode(node, label);
//     //     return graph;
//     // }    

//     // static addMultipleElementsToGraph(graph: graphlib.Graph ,elements: Producer[] | Subscriber[]): graphlib.Graph {
//     //     elements.forEach(element => {
//     //         const randomNode = Util.randomFromArray(graph.nodes());            
//     //         GraphHelperFunctions.addSingleElementToGraph(graph, randomNode, element);
//     //     })
    
//     //     return graph;
//     // }

//     static addMultipleSubscribersToGraph(graph: graphlib.Graph ,subscribers: Subscriber[]): graphlib.Graph {
//         subscribers.forEach(subscriber => {
//             const randomNode = Util.randomFromArray(graph.nodes());         
//             const label = Util.getNodeLabel(graph, randomNode);   
//             label.subscribers.push(subscriber);
//             graph.setNode(randomNode, label);            
//         })
//         return graph;
//     }

//     static addMultipleProducersToGraph(graph: graphlib.Graph ,tree: ContentTree, producers: Producer[]): graphlib.Graph {
//         producers.forEach(producer => {
//             const randomNode = Util.randomFromArray(graph.nodes());         
//             const label = Util.getNodeLabel(graph, randomNode);   
//             label.producers.push(producer);
//             graph.setNode(randomNode, label);            
//         })
//         return graph;
//     }
// }