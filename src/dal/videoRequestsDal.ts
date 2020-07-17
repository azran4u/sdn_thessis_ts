// import { QueryResult } from 'pg';
// import { dbInstance as db, DB_TABLES } from '../database/databaseConnector';
// import { VideoRequest } from '../model';

// export type VideoRequestInput = Omit<VideoRequest, 'id'>;

// export class VideoRequestDal {

//     public static async insert(videoRequest: VideoRequestInput) {
//         await db.insertObject(DB_TABLES.REQUESTS, videoRequest);
//     }

//     public static async insertAndRead(videoRequest: VideoRequestInput): Promise<VideoRequest> {
//         await VideoRequestDal.insert(videoRequest);
//         return await VideoRequestDal.getOne(videoRequest);
//     }

//     public static async getOne(videoRequest: VideoRequestInput): Promise<VideoRequest> {
//         let sql = `SELECT *
//         FROM ${DB_TABLES.REQUESTS}
//         WHERE subscriber = $1 and producer = $2 and layer = $3`
//         let data: string[] = [videoRequest.subscriber.toString(), videoRequest.producer.toString(), videoRequest.layer.toString()];
//         const res = await db.query(sql, data);
//         const out = VideoRequestDal.parseResults(res);
//         if (out.length === 1) return out[0];
//     }

//     public static async getAll(): Promise<VideoRequest[]> {
//         let sql = `SELECT * from ${DB_TABLES.REQUESTS}`;
//         let data: string[] = [];
//         const res = await db.query(sql, data);
//         return VideoRequestDal.parseResults(res);
//     }

//     private static parseResults(res: QueryResult): VideoRequest[] {
//         let out: VideoRequest[] = [];
//         out = res.rows.map(row => {
//             return {
//                 id: row._id,
//                 producer: row.producer,
//                 subscriber: row.subscriber,
//                 layer: row.layer
//             } as VideoRequest;
//         });
//         return out;
//     }
// }
