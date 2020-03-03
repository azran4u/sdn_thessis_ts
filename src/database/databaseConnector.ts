import { Pool } from 'pg';

export interface DatabaseConnectorOptions {
    host: string;
    database: string;
    user: string;
    password: string;
    port: number;
}

export class DatabaseConnector {
    private static instance: DatabaseConnector;
    private pool: Pool;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor(options: DatabaseConnectorOptions) {
        console.log(`DatabaseConnector constructor options=${JSON.stringify(options)}`);
        this.pool = new Pool({
            host: options.host,
            database: options.database,
            user: options.user,            
            password: options.password,
            port: options.port,
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

    public disconnect(){
        console.log(`DatabaseConnector disconnecting`);
        this.pool.end(); 
    }

    public async query(text: string, values?: string[]) {
        return this.pool.query(text, values);
    }

    public async getCurrentTime(): Promise<Date> {
        console.log(`DatabaseConnector getCurrentTime`);
        let res;
        try{
            res = await this.query('SELECT NOW()');     
            return new Date(res.rows[0].now);       
        }
        catch(err) {            
            console.error(`DatabaseConnector error ${err.stack}`);
            throw(err);            
        }                    
    }
}
