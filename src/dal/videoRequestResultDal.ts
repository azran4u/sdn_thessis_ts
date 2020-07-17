// import { QueryResult } from 'pg';
// import { dbInstance as db, DB_TABLES } from '../database/databaseConnector';
// import { VideoRequestResult } from '../model';

// export type VideoRequestResultInput = Omit<VideoRequestResult, 'id'>;

// export class VideoRequestResultDal {

//     public static async insert(videoRequestResult: VideoRequestResultInput) {
//         await db.insertObject(DB_TABLES.VIDEO_REQUESTS_RESULTS, videoRequestResult);
//     }

//     public static async insertAndRead(videoRequestResult: VideoRequestResultInput): Promise<VideoRequestResult> {
//         await VideoRequestResultDal.insert(videoRequestResult);
//         return await VideoRequestResultDal.getOne(videoRequestResult);
//     }

//     public static async getOne(videoRequestResult: VideoRequestResultInput): Promise<VideoRequestResult> {
//         let sql = `SELECT *
//         FROM ${DB_TABLES.VIDEO_REQUESTS_RESULTS}
//         WHERE alogorithm = $1 and videoRequest = $2`
//         let data: string[] = [videoRequestResult.alogorithm, videoRequestResult.videoRequest.toString()];
//         const res = await db.query(sql, data);
//         const out = VideoRequestResultDal.parseResults(res);
//         if (out.length === 1) return out[0];
//     }

//     public static async getAll(): Promise<VideoRequestResult[]> {
//         let sql = `SELECT * from ${DB_TABLES.VIDEO_REQUESTS_RESULTS}`;
//         let data: string[] = [];
//         const res = await db.query(sql, data);
//         return VideoRequestResultDal.parseResults(res);
//     }

//     private static parseResults(res: QueryResult): VideoRequestResult[] {
//         let out: VideoRequestResult[] = [];
//         out = res.rows.map(row => {
//             return {
//                 id: row._id,
//                 alogorithm: row.alogorithm,
//                 videoRequest: row.videoRequest,
//                 status: row.status,
//                 e2e_latency: row.e2e_latency,
//                 e2e_jitter: row.e2e_jitter,
//                 e2e_hopCount: row.e2e_hopCount
//             } as VideoRequestResult;
//         });
//         return out;
//     }
// }
