// import { QueryResult } from 'pg';
// import { dbInstance as db, DB_TABLES } from '../database/databaseConnector';
// import { NetworkNode } from '../model';

// export type NetworkNodeInput = Omit<NetworkNode, 'id'>;

// export class NetworkNodeDal {    

//     public static async insertAndRead(): Promise<NetworkNode> {
//         const res = await db.query(`insert into ${DB_TABLES.NODES} values(default) returning *`, []);
//         return { id: res.rows[0]._id };
//     }

//     public static async getAll(): Promise<NetworkNode[]> {
//         let sql = `SELECT * from ${DB_TABLES.NODES}`;
//         let data: string[] = [];
//         const res = await db.query(sql, data);
//         return NetworkNodeDal.parseResults(res);
//     }

//     private static parseResults(res: QueryResult): NetworkNode[] {
//         let out: NetworkNode[] = [];
//         out = res.rows.map(row => {
//             return {
//                 id: row._id
//             } as NetworkNode;
//         });
//         return out;
//     }
// }
