import { Store } from "../store";
import { createObjectCsvWriter } from "csv-writer";

export class SimulationUtil {
    static async printResultsToCSV(store: Store) {
        const csvWriter = createObjectCsvWriter({
            path: 'file.csv',
            header: [
                { id: 'id', title: 'id' },
                { id: 'subscriber', title: 'subscriber' },
                { id: 'subscriber_node', title: 'subscriber_node' },
                { id: 'producer', title: 'producer' },
                { id: 'producer_node', title: 'producer_node' },
                { id: 'layer', title: 'layer' },
                { id: 'alogorithm', title: 'alogorithm' },
                { id: 'status', title: 'status' },
                { id: 'e2e_path', title: 'e2e_path' },
                { id: 'e2e_latency', title: 'e2e_latency' },
                { id: 'e2e_jitter', title: 'e2e_jitter' },
                { id: 'e2e_hopCount', title: 'e2e_hopCount' }
            ]
        });

        const allVideoRequests = store.allVideoRequests();
        const allVideoRequestsResults = store.allVideoRequestsResults();
        const allSubscribers = store.allSubscribers();
        const allProducers = store.allProducers();
        const records = allVideoRequests.map(videoRequest => {
            const result = allVideoRequestsResults.find(result => { return result.videoRequestId === videoRequest.id });
            const subscriber = allSubscribers.find(subscriber => {return subscriber.id === videoRequest.subscriber});
            const producer = allProducers.find(producer => {return producer.id === videoRequest.producer});
            return {
                id: videoRequest.id,
                subscriber: videoRequest.subscriber,
                subscriber_node: subscriber.node,
                producer: videoRequest.producer,
                producer_node: producer.node,
                layer: videoRequest.layer,
                alogorithm: result.alogorithm,
                status: result.status,
                e2e_path: result.status === 'SERVED' ? result.e2e_path.edges.toString() : -1,
                e2e_latency: result.status === 'SERVED' ? result.e2e_path.latency : -1,
                e2e_jitter: result.status === 'SERVED' ? result.e2e_path.jitter: -1,
                e2e_hopCount: result.status === 'SERVED' ? result.e2e_path.hopCount : -1
            }
        })

        try {
            await csvWriter.writeRecords(records);
            console.log(`csv is ready`);
        } catch (error) {
            console.error(error);
        }
    }
}