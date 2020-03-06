import { QueryResult } from 'pg';
import { dbInstance as db, DatabaseConnector, DB_TABLES } from './databaseConnector';
import { NetworkNode } from '../model/model';

export type NetworkNodeInput = Omit<NetworkNode, 'id'>;

export class NetworkNodeDal {

    public static async insert(node: NetworkNodeInput) {        
        await db.insertObject(DB_TABLES.NODES, node, ['text']);        
    }

    public static async insertAndRead(node: NetworkNodeInput): Promise<NetworkNode> {        
        await NetworkNodeDal.insert(node);
        return await NetworkNodeDal.getOneByText(node.text);        
    }

    public static async getAll(): Promise<NetworkNode[]> {        
        let sql = `SELECT * from ${DB_TABLES.NODES}`;
        let data: string[] = [];
        const res = await db.query(sql, data);
        return NetworkNodeDal.parseResults(res);
    }

    public static async getOneByText(text: string): Promise<NetworkNode> {                
        let sql = `SELECT * from nodes where text = $1`;
        let data: string[] = [text];
        const res = await db.query(sql, data);
        const out = NetworkNodeDal.parseResults(res);
        if (out.length === 1) return out[0];
    }

    public static async getManyByText(text: string[]): Promise<NetworkNode[]> {                
        const params = DatabaseConnector.sqlParams(text.length);
        let sql = `SELECT * from nodes where text IN (${params})`;
        let data: string[] = text;
        const res = await db.query(sql, data);
        return NetworkNodeDal.parseResults(res);        
    }

    private static parseResults(res: QueryResult): NetworkNode[] {
        let out: NetworkNode[] = [];
        out = res.rows.map(row => {
            return {
                id: row._id,
                text: row.text
            } as NetworkNode;
        });
        return out;
    }
}
