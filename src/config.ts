import { LAYER } from "./model/layer";


export interface Range {
    min: number,
    max: number
}

export type LAYERS_BW_RANGE = {[key in keyof typeof LAYER]: Range};
export type LAYERS_BW = {[key in keyof typeof LAYER]: number};

export interface Config {
    edge: {
        bw: Range;
        latency: Range;
        jitter: Range;
    },
    producer: {
        count: number;
        bw: LAYERS_BW_RANGE
    }
}

export const config: Config = {
    edge: {
        bw: {
            min: 1,
            max: 5
        },
        latency: {
            min: 1,
            max: 10
        },
        jitter: {
            min: 1,
            max: 5
        }
    },
    producer: {
        count: 3,
        bw: {
            BASE_LAYER: {min: 1, max: 10},
            EL1: {min: 5, max: 15},
            EL2: {min: 10, max: 20}
        }
    }
}