// import { QueryResult } from 'pg';
// import { dbInstance as db, DB_TABLES } from '../database/databaseConnector';
// import { Producer } from '../model';

// export type ProducerInput = Omit<Producer, 'id'>;

// export class ProducerDal {

//     public static async insert(producer: ProducerInput) {
//         await db.insertObject(DB_TABLES.PRODUCERS, producer);
//     }

//     public static async insertAndRead(producer: ProducerInput): Promise<Producer> {
//         await ProducerDal.insert(producer);
//         return await ProducerDal.getOneByNode(producer.node);
//     }

//     public static async getAll(): Promise<Producer[]> {
//         let sql = `SELECT * from ${DB_TABLES.PRODUCERS}`;
//         let data: string[] = [];
//         const res = await db.query(sql, data);
//         return ProducerDal.parseResults(res);
//     }

//     public static async getOneByNode(node: number): Promise<Producer> {
//         let sql = `SELECT *
//         FROM ${DB_TABLES.PRODUCERS}
//         WHERE node = $1`
//         let data: string[] = [node.toString()];
//         const res = await db.query(sql, data);
//         const out = ProducerDal.parseResults(res);
//         if (out.length === 1) return out[0];
//     }

//     private static parseResults(res: QueryResult): Producer[] {
//         let out: Producer[] = [];
//         out = res.rows.map(row => {
//             return {
//                 id: row._id,
//                 node: row.node,
//                 base_layer_bw: row.base_layer_bw,
//                 enhancement_layer_1_bw: row.enhancement_layer_1_bw,
//                 enhancement_layer_2_bw: row.enhancement_layer_2_bw
//             } as Producer;
//         });
//         return out;
//     }
// }
