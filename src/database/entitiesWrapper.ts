// import { DatabaseConnector } from './databaseConnector';
// import { NetworkNode } from '../model';

// export class EntitiesWrapper {

//     constructor(private dbInstance: DatabaseConnector) { }

//     public async createNode(name: string): Promise<NetworkNode> {
//         const text = 'INSERT INTO nodes(node_name) VALUES($1) RETURNING *';
//         const values = [name];
//         const rows = this.dbInstance.query(text, values);
//         return null;
//     }

//     public async updateNode(id: string, name: string): Promise<NetworkNode> {
//         return null;
//     }

//     public async deleteNode(id: string) {

//     }

//     public async readNode(id: string): Promise<NetworkNode> {
//         return null;
//     }
// }