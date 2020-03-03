"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
class DatabaseConnector {
    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    constructor(options) {
        console.log(`DatabaseConnector constructor options=${JSON.stringify(options)}`);
        this.pool = new pg_1.Pool({
            host: options.host,
            database: options.database,
            user: options.user,
            password: options.password,
            port: options.port,
        });
    }
    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    static getInstance(options) {
        if (!DatabaseConnector.instance) {
            if (!options) {
                throw new Error(`couldn't create first DatabaseConnector w/o options`);
            }
            else {
                DatabaseConnector.instance = new DatabaseConnector(options);
            }
        }
        return DatabaseConnector.instance;
    }
    disconnect() {
        console.log(`DatabaseConnector disconnecting`);
        this.pool.end();
    }
    query(text, values) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.pool.query(text, values);
        });
    }
    getCurrentTime() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`DatabaseConnector getCurrentTime`);
            let res;
            try {
                res = yield this.query('SELECT NOW()');
                return new Date(res.rows[0].now);
            }
            catch (err) {
                console.error(`DatabaseConnector error ${err.stack}`);
                throw (err);
            }
        });
    }
}
exports.DatabaseConnector = DatabaseConnector;
//# sourceMappingURL=databaseConnector.js.map