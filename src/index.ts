// import { Scenario } from './simulations/sim1/scenario';
import dotenv from 'dotenv'
import { DatabaseConnector } from './database';

dotenv.config();
// const sim1 = new Scenario().start();

start();


async function start(){

    const db1 = DatabaseConnector.getInstance({
        host: process.env.POSTGRES_HOST || 'POSTGRES_HOST',
        database: process.env.POSTGRES_DATABASE || 'POSTGRES_DATABASE',
        password: process.env.POSTGRES_PASSWORD || 'POSTGRES_PASSWORD',
        user: process.env.POSTGRES_USER || 'POSTGRES_USER',
        port: +process.env.POSTGRES_PORT || 5432,
    });
    const date1 = await db1.getCurrentTime();
    console.log(`date1=${date1}`);
    const db2 = DatabaseConnector.getInstance();
    const date2 = await db2.getCurrentTime();
    console.log(`date2=${date2}`);
    await db1.disconnect();
}