import { QueryResult } from 'pg';
import { dbInstance as db, DB_TABLES } from './databaseConnector';
import { Subscriber } from '../model/model';

export type SubscriberInput = Omit<Subscriber, 'id'>;

export class SubscriberDal {

    public static async insert(subscriber: SubscriberInput) {
        await db.insertObject(DB_TABLES.SUBSCRIBERS, subscriber);
    }

    public static async insertAndRead(subscriber: SubscriberInput): Promise<Subscriber> {
        await SubscriberDal.insert(subscriber);
        return await SubscriberDal.getOneByNode(subscriber.node);
    }

    public static async getAll(): Promise<Subscriber[]> {
        let sql = `SELECT * from ${DB_TABLES.SUBSCRIBERS}`;
        let data: string[] = [];
        const res = await db.query(sql, data);
        return SubscriberDal.parseResults(res);
    }

    public static async getOneByNode(node: number): Promise<Subscriber> {
        let sql = `SELECT *
        FROM ${DB_TABLES.SUBSCRIBERS}
        WHERE node = $1`
        let data: string[] = [node.toString()];
        const res = await db.query(sql, data);
        const out = SubscriberDal.parseResults(res);
        if (out.length === 1) return out[0];
    }

    private static parseResults(res: QueryResult): Subscriber[] {
        let out: Subscriber[] = [];
        out = res.rows.map(row => {
            return {
                id: row._id,
                node: row.node,
                priority: row.priority
            } as Subscriber;
        });
        return out;
    }
}
