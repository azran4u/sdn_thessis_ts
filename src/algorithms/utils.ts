import { Producer, LAYER } from "../model";
import * as graphlib from 'graphlib';

export function getProducerBwByLayer(producer: Producer, layer: LAYER): number {
    let bw;
    switch (layer) {
        case "BASE": {
            bw = producer.base_layer_bw;
            break;
        }
        case "EL1": {
            bw = producer.enhancement_layer_1_bw;
            break;
        }
        case "EL2": {
            bw = producer.enhancement_layer_2_bw;
            break;
        }
    }
    return bw;
}

export function contentToKey(producerId: string, layer: LAYER) {
    return JSON.stringify({
        producer: producerId,
        layer: layer
    })
}
