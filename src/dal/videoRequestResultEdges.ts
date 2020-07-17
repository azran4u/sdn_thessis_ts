// import { QueryResult } from 'pg';
// import { dbInstance as db, DB_TABLES } from '../database/databaseConnector';
// import { VideoRequestResultEdges } from '../model';

// export type VideoRequestResultEdgesInput = Omit<VideoRequestResultEdges, 'id'>;

// export class VideoRequestResultEdgesDal {

//     public static async insert(videoRequestResultEdge: VideoRequestResultEdgesInput) {
//         await db.insertObject(DB_TABLES.VIDEO_REQUESTS_RESULTS_EDGES, videoRequestResultEdge);
//     }

//     public static async insertAndRead(videoRequestResultEdge: VideoRequestResultEdgesInput): Promise<VideoRequestResultEdges> {
//         await VideoRequestResultEdgesDal.insert(videoRequestResultEdge);
//         return await VideoRequestResultEdgesDal.getOne(videoRequestResultEdge);
//     }

//     public static async getOne(videoRequestResultEdge: VideoRequestResultEdgesInput): Promise<VideoRequestResultEdges> {
//         let sql = `SELECT *
//         FROM ${DB_TABLES.VIDEO_REQUESTS_RESULTS_EDGES}
//         WHERE videoRequestResult = $1 and edge = $2`
//         let data: string[] = [videoRequestResultEdge.videoRequestResult.toString(), videoRequestResultEdge.edge.toString()];
//         const res = await db.query(sql, data);
//         const out = VideoRequestResultEdgesDal.parseResults(res);
//         if (out.length === 1) return out[0];
//     }

//     public static async getAll(): Promise<VideoRequestResultEdges[]> {
//         let sql = `SELECT * from ${DB_TABLES.VIDEO_REQUESTS_RESULTS}`;
//         let data: string[] = [];
//         const res = await db.query(sql, data);
//         return VideoRequestResultEdgesDal.parseResults(res);
//     }

//     private static parseResults(res: QueryResult): VideoRequestResultEdges[] {
//         let out: VideoRequestResultEdges[] = [];
//         out = res.rows.map(row => {
//             return {
//                 id: row._id,
//                 videoRequestResult: row.videoRequestResultId,
//                 edge: row.edge
//             } as VideoRequestResultEdges;
//         });
//         return out;
//     }
// }
