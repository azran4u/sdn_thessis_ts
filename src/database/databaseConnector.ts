// import { Pool, PoolClient, QueryResult, QueryConfig } from 'pg';
// import logger = require('./../utils/logger');
// import { config } from '../config';

// export enum DB_TABLES {
//     NODES = 'nodes',
//     EDGES = 'edges',
//     PRODUCERS = 'producers',
//     SUBSCRIBERS = 'subscribers',
//     REQUESTS = 'requests',
//     VIDEO_REQUESTS_RESULTS = 'VideoRequestsResults',
//     VIDEO_REQUESTS_RESULTS_EDGES = 'VideoRequestsResultsEdges'
// }

// export interface DatabaseConnectorOptions {
//     host: string;
//     database: string;
//     user: string;
//     password: string;
//     port: number;
//     idleTimeoutMillis: number;
//     max_clients: number;
// }

// export class DatabaseConnector {
//     private static instance: DatabaseConnector;
//     private pool: Pool;

//     /**
//      * The Singleton's constructor should always be private to prevent direct
//      * construction calls with the `new` operator.
//      */
//     private constructor(options: DatabaseConnectorOptions) {
//         this.pool = new Pool({
//             host: options.host,
//             database: options.database,
//             user: options.user,
//             password: options.password,
//             port: options.port,
//             max: options.max_clients,
//             idleTimeoutMillis: options.idleTimeoutMillis
//         });
//         logger.debug(`DB Connection Settings: ${JSON.stringify(options)}`);

//         this.pool.on('error', function (err: Error, client: PoolClient) {
//             logger.error(`idle client error, ${err.message} | ${err.stack}`);
//         });
//     }

//     public static getInstance(options?: DatabaseConnectorOptions): DatabaseConnector {
//         if (!DatabaseConnector.instance) {
//             if (!options) {
//                 throw new Error(`couldn't create first DatabaseConnector w/o options`);
//             }
//             else {
//                 DatabaseConnector.instance = new DatabaseConnector(options);
//                 logger.info('db connected');
//             }
//         }
//         return DatabaseConnector.instance;
//     }

//     public disconnect() {
//         logger.debug(`[DatabaseConnector]: disconnecting`);
//         this.pool.end();
//         DatabaseConnector.instance = undefined;
//     }

//     /* 
//     * Single Query to Postgres
//     * @param sql: the query for store data
//     * @param data: the data to be stored
//     * @return result
//     */
//     public async query(sql: string, data: string[]) {
//         logger.debug(`[DatabaseConnector]: query: ${sql} | data: ${data}`);
//         let result: QueryResult;
//         try {
//             result = await this.pool.query(sql, data);
//             return result;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }

//     public async insert(sql: string, data: string[]) {
//         logger.debug(`[DatabaseConnector]: insert: ${sql} | data: ${data}`);
//         try {
//             await this.pool.query(sql, data);
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }

//     public async insertObject(table: DB_TABLES, obj: Object, conflict?: string[]) {
//         try {
//             const columns = DatabaseConnector.sqlCoulmnsNames(obj);
//             const params = DatabaseConnector.sqlParams(Object.keys(obj).length);
//             const values = DatabaseConnector.sqlCoulmnsValues(obj);
//             let sql = `INSERT INTO ${table} (${columns}) VALUES (${params})`;
//             if (conflict) {
//                 const onConflict = DatabaseConnector.sqlOnConflict(conflict);
//                 sql = `${sql} ON CONFLICT (${onConflict}) DO NOTHING`
//             }
//             await DatabaseConnector.getInstance().insert(sql, values);
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }

//     public async transaction(queries: QueryConfig[]) {
//         let client: PoolClient;
//         try {
//             client = await DatabaseConnector.getInstance().pool.connect();
//             await client.query('BEGIN');
//             for (let i = 0; i < queries.length; i++) {
//                 await client.query(queries[i]);
//             }
//             await client.query('COMMIT');
//         } catch (error) {
//             try {
//                 await client.query('ROLLBACK')
//             } catch (error) {
//                 throw error;
//             }
//             throw error;
//         } finally {
//             client.release();
//         }
//     }


//     public static sqlOnConflict(conflict: string[]): string {
//         return `${conflict.join(',')}`;
//     }

//     public static sqlParams(count: number): string {
//         let params: string[] = [];
//         for (var i = 1; i <= count; i++) {
//             params.push('$' + i);
//         }
//         return params.join(',');
//     }

//     public static sqlCoulmnsNames(obj: Object): string {
//         return Object.keys(obj).join(',');
//     }

//     public static sqlCoulmnsValues(obj: Object): string[] {
//         return Object.values(obj);
//     }
// }

// export const dbInstance = DatabaseConnector.getInstance(config.postgres);