import { Store } from "../store";
import { createObjectCsvWriter } from "csv-writer";

export class SimulationUtil {
    static async printResultsToCSV(store: Store) {
        const csvWriter = createObjectCsvWriter({
            path: 'file.csv',
            header: [
                { id: 'id', title: 'id' },
                { id: 'subscriber', title: 'subscriber' },
                { id: 'producer', title: 'producer' },
                { id: 'layer', title: 'layer' },
                { id: 'alogorithm', title: 'alogorithm' },
                { id: 'status', title: 'status' },
                { id: 'e2e_latency', title: 'e2e_latency' },
                { id: 'e2e_jitter', title: 'e2e_jitter' },
                { id: 'e2e_hopCount', title: 'e2e_hopCount' }
            ]
        });

        const allVideoRequests = store.allVideoRequests();
        const allVideoRequestsResults = store.allVideoRequestsResults();
        const records = allVideoRequests.map(videoRequest => {
            const result = allVideoRequestsResults.find(result => { return result.videoRequestId === videoRequest.id });
            return {

                id: videoRequest.id,
                subscriber: videoRequest.subscriber,
                producer: videoRequest.producer,
                layer: videoRequest.layer,
                alogorithm: result.alogorithm,
                status: result.status,
                e2e_latency: result.e2e_path.latency,
                e2e_jitter: result.e2e_path.jitter,
                e2e_hopCount: result.e2e_path.hopCount
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