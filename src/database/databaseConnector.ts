import { Pool, PoolClient, QueryResult } from 'pg';
import logger = require('./../utils/logger');

export interface DatabaseConnectorOptions {
    host: string;
    database: string;
    user: string;
    password: string;
    port: number;
    idleTimeoutMillis: number;
    max_clients: number;
}

export class DatabaseConnector {
    private static instance: DatabaseConnector;
    private pool: Pool;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor(options: DatabaseConnectorOptions) {
        this.pool = new Pool({
            host: options.host,
            database: options.database,
            user: options.user,
            password: options.password,
            port: options.port,
            max: options.max_clients,
            idleTimeoutMillis: options.idleTimeoutMillis
        });
        logger.debug(`DB Connection Settings: ${JSON.stringify(options)}`);

        this.pool.on('error', function (err: Error, client: PoolClient) {
            logger.error(`idle client error, ${err.message} | ${err.stack}`);
        });
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(options?: DatabaseConnectorOptions): DatabaseConnector {
        if (!DatabaseConnector.instance) {
            if (!options) {
                throw new Error(`couldn't create first DatabaseConnector w/o options`);
            }
            else {
                DatabaseConnector.instance = new DatabaseConnector(options);
            }
        }
        return DatabaseConnector.instance;
    }

    public disconnect() {
        logger.debug(`[DatabaseConnector]: disconnecting`);
        this.pool.end();
        DatabaseConnector.instance = undefined;
    }

    /* 
    * Single Query to Postgres
    * @param sql: the query for store data
    * @param data: the data to be stored
    * @return result
    */
    public async query(sql: string, data: string[]) {
        logger.debug(`[DatabaseConnector]: query: ${sql} | data: ${data}`);
        let result: QueryResult;
        try {
            result = await this.pool.query(sql, data);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async insert(sql: string, data: string[]) {
        logger.debug(`[DatabaseConnector]: insert: ${sql} | data: ${data}`);
        try {
            await this.pool.query(sql, data);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public static generateParamFromArrayString(arr: string[]): string {
        let params: string[] = [];
        for (var i = 1; i <= arr.length; i++) {
            params.push('$' + i);
        }
        return params.join(',');
    }
    // public async query(text: string, values?: string[]): Promise<any[]> {
    //     try{
    //         const {rows} = await this.pool.query(text, values);
    //         return rows;
    //     }
    //     catch(err) {            
    //         console.error(`${err}`);
    //         throw(err);            
    //     }

    // }

    /*
 * Retrieve a SQL client with transaction from connection pool. If the client is valid, either
 * COMMMIT or ROALLBACK needs to be called at the end before releasing the connection back to pool.
 */
    public async startTransaction() {
        logger.debug(`getTransaction()`);
        const client: PoolClient = await this.pool.connect();
        try {
            await client.query('BEGIN');
            return client;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* 
     * Execute a sql statment with a single row of data
     * @param sql: the query for store data
     * @param data: the data to be stored
     * @return result
     */
    public async sqlExecSingleRow(client: PoolClient, sql: string, data: string[]) {
        logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);
        let result: QueryResult;
        try {
            result = await client.query(sql, data);
            logger.debug(`sqlExecSingleRow(): ${result.command} | ${result.rowCount}`);
            return result
        } catch (error) {
            logger.error(`sqlExecSingleRow() error: ${error.message} | sql: ${sql} | data: ${data}`);
            throw new Error(error.message);
        }
    }

    /*
     * Execute a sql statement with multiple rows of parameter data.
     * @param sql: the query for store data
     * @param data: the data to be stored
     * @return result
     */
    public async sqlExecMultipleRows(client: PoolClient, sql: string, data: string[][]) {
        logger.debug(`inside sqlExecMultipleRows()`);
        logger.debug(`sqlExecMultipleRows() data: ${data}`);
        if (data.length !== 0) {
            for (let item of data) {
                try {
                    logger.debug(`sqlExecMultipleRows() item: ${item}`);
                    logger.debug(`sqlExecMultipleRows() sql: ${sql}`);
                    await client.query(sql, item);
                } catch (error) {
                    logger.error(`sqlExecMultipleRows() error: ${error}`);
                    throw new Error(error.message);
                }
            }
        } else {
            logger.error(`sqlExecMultipleRows(): No data available`);
            throw new Error('sqlExecMultipleRows(): No data available');
        }
    }

    /*
     * Rollback transaction
     */
    public async rollback(client: PoolClient) {
        if (typeof client !== 'undefined' && client) {
            try {
                logger.info(`sql transaction rollback`);
                await client.query('ROLLBACK');
            } catch (error) {
                throw new Error(error.message);
            } finally {
                client.release();
            }
        } else {
            logger.warn(`rollback() not excuted. client is not set`);
        }
    }

    /*
     * Commit transaction
     */
    public async commit(client: PoolClient) {
        logger.debug(`sql transaction committed`);
        try {
            await client.query('COMMIT');
        } catch (error) {
            throw new Error(error.message);
        } finally {
            client.release();
        }
    }
}
