// import { QueryResult } from 'pg';
// import { DatabaseConnector } from '../database/databaseConnector';
// import logger = require('../utils/logger');

// export class GlobalDal {
//     public static async getDatabaseTime() {
//         const db = DatabaseConnector.getInstance();
//         let sql = "SELECT NOW();";
//         let data: string[] = [];
//         let result: QueryResult;
//         try {
//             result = await db.query(sql, data);
//             return result;
//         } catch (error) {
//             logger.error(`[getDatabaseTime]: ${error.message}`);
//             throw new Error(error.message);
//         }
//     }

//     public static async deleteAllDbContent() {
//         const db = DatabaseConnector.getInstance();        
//         let sql = `TRUNCATE nodes CASCADE`;
//         let data: string[] = [];
//         await db.query(sql, data);                
//     }
// }
