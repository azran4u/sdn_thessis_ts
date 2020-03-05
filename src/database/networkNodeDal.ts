import { QueryResult } from 'pg';
import { DatabaseConnector } from './databaseConnector';
import logger from '../utils/logger';
import { NetworkNode } from '../model/model';

export class NetworkNodeDal {
    public static async insertNetworkNode(name: string) {
        const db = DatabaseConnector.getInstance();
        let sql = "INSERT INTO nodes (node_name) VALUES ($1) ON CONFLICT (node_name) DO NOTHING";
        let data: string[] = [name];
        await db.insert(sql, data);
    }

    public static async getAllNetworkNode(): Promise<NetworkNode[]> {
        const db = DatabaseConnector.getInstance();
        let sql = "SELECT * from nodes";
        let data: string[] = [];
        const res = await db.query(sql, data);
        return NetworkNodeDal.rowsToNetworkNodeArray(res);
    }

    public static async getByNames(names: string[]): Promise<NetworkNode[]> {
        const db = DatabaseConnector.getInstance();
        const params = DatabaseConnector.generateParamFromArrayString(names);
        let sql = `SELECT * from nodes where node_name IN (${params})`;
        let data: string[] = names;
        const res = await db.query(sql, data);        
        return NetworkNodeDal.rowsToNetworkNodeArray(res);
    }
    
    private static rowsToNetworkNodeArray(res: QueryResult): NetworkNode[] {
        let out: NetworkNode[] = [];
        out = res.rows.map(row => {
            return {
                id: row.node_id,
                name: row.node_name
            } as NetworkNode;
        });
        return out;
    }
}
