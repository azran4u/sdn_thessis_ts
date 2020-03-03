import * as graphlib from 'graphlib';
import { lbs } from '../../algorithms/lbs';
import { Producer } from '../../model/producer';
import { Subscriber } from '../../model/subscriber';
import { VideoRequest } from '../../model/videoRequest';
import { NodeLabel } from '../../model/nodeLabel';
import { EdgeLabel } from '../../model/edgeLabel';
import { Simulation } from '../../model/simulation/simulation';
import { SimulationResults } from '../../model/simulation/simulationResults';
import { GraphHelperFunctions } from '../../model/graphHelperFunctions';
import { ContentTree } from '../../model/tree';
import { Network } from '../../model/network';

export class Scenario implements Simulation {
    public start(): SimulationResults {
        let tree : ContentTree;
        const graph = Scenario.createSimpleGraph();
        const producers = Producer.createRandom(2);
        GraphHelperFunctions.addMultipleProducersToGraph(graph, tree, producers);
        const subscribers = Subscriber.createRandom(2);
        GraphHelperFunctions.addMultipleSubscribersToGraph(graph, subscribers);
        const requests = VideoRequest.createRandom(subscribers, producers, 2);

        const network: Network = {
            graph: graph,
            producers: producers,
            subscribers: subscribers,
            requests: requests
        }
        const lbsNetwork = lbs(network);
        console.log(network);

        return { input: network, output: network };
    }

    private static createSimpleGraph(): graphlib.Graph {
        const g = new graphlib.Graph({
            directed: true
        });

        g.setNode('a', NodeLabel.createRandom());
        g.setNode('b', NodeLabel.createRandom());
        g.setNode('c', NodeLabel.createRandom());
        g.setEdge('a', 'b', EdgeLabel.createRandom());
        g.setEdge('b', 'a', EdgeLabel.createRandom());
        g.setEdge('b', 'c', EdgeLabel.createRandom());
        g.setEdge('c', 'b', EdgeLabel.createRandom());
        g.setEdge('a', 'c', EdgeLabel.createRandom());
        g.setEdge('c', 'a', EdgeLabel.createRandom());

        return g;
    };
}



