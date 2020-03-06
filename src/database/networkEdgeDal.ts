import { QueryResult } from 'pg';
import { dbInstance as db, DB_TABLES } from './databaseConnector';
import { NetworkEdge } from '../model/model';

export type NetworkEdgeInput = Omit<NetworkEdge, 'id'>;

export class NetworkEdgeDal {

    public static async insert(edge: NetworkEdgeInput) {
        await db.insertObject(DB_TABLES.EDGES, edge, ['from_node, to_node']);
    }

    public static async insertAndRead(edge: NetworkEdgeInput): Promise<NetworkEdge> {
        await NetworkEdgeDal.insert(edge);
        return await NetworkEdgeDal.getOneByFromTo(edge.from_node, edge.to_node);
    }

    public static async getAll(): Promise<NetworkEdge[]> {
        let sql = `SELECT * from ${DB_TABLES.EDGES}`;
        let data: string[] = [];
        const res = await db.query(sql, data);
        return NetworkEdgeDal.parseResults(res);
    }

    public static async getOneByFromTo(from: number, to: number): Promise<NetworkEdge> {
        let sql = `SELECT *
        FROM ${DB_TABLES.EDGES}
        WHERE from_node = $1 and to_node = $2`
        let data: string[] = [from.toString(), to.toString()];
        const res = await db.query(sql, data);
        const out = NetworkEdgeDal.parseResults(res);
        if (out.length === 1) return out[0];
    }

    private static parseResults(res: QueryResult): NetworkEdge[] {
        let out: NetworkEdge[] = [];
        out = res.rows.map(row => {
            return {
                id: row._id,
                from_node: row.from_node,
                to_node: row.to_node,
                bw: row.bw,
                jitter: row.jitter,
                latency: row.latency
            } as NetworkEdge;
        });
        return out;
    }
}
