import { LAYER } from "./model/layer";
import * as dotenv from 'dotenv';
import path from 'path';

//DO NOT COMMIT YOUR .env FILE
// dotenv.config();
const envFileName = process.env.ENVIRONMENT || "";
dotenv.config({ path: path.resolve(__dirname, `../deploy/env/${envFileName}.env`)});

export interface Range {
    min: number,
    max: number
}

export type LAYERS_BW_RANGE = { [key in keyof typeof LAYER]: Range };
export type LAYERS_BW = { [key in keyof typeof LAYER]: number };

export interface Config {
    general: {
        serviceName: string;
    }
    web_server: {
        port: number;
    }    
    logger: {
        loggerLevel: string,
    }    
    postgres: {
        host: string;
        database: string;
        user: string;
        password: string;
        port: number;
        max_clients: number;
        idleTimeoutMillis: number;
    }
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
    general: {
        serviceName: process.env.SERVICENAME || 'node typescript postgres app',
    },
    web_server: {
        port: Number(process.env.PORT) || 3000,
    },
    logger: {
        loggerLevel: 'debug',
    },    
    postgres: {
        host: process.env.POSTGRES_HOST || 'POSTGRES_HOST',
        database: process.env.POSTGRES_DATABASE || 'POSTGRES_DATABASE',
        password: process.env.POSTGRES_PASSWORD || 'POSTGRES_PASSWORD',
        user: process.env.POSTGRES_USER || 'POSTGRES_USER',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        max_clients: Number(process.env.DB_MAX_CLIENTS) || 20,
        idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000
    },
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
            BASE_LAYER: { min: 1, max: 10 },
            EL1: { min: 5, max: 15 },
            EL2: { min: 10, max: 20 }
        }
    }
}