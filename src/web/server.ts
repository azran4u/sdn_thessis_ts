import express from 'express';
import cors from 'cors';
import { data } from './staticData';
import { D3Formatter } from './dynamicData';

export class WebServer {
    constructor(private formatter: D3Formatter){
        this.formatter = formatter;
    }

    run() {
        const app = express()
        const port = 80

        app.use(cors());
        app.get('/', (req, res) => res.send(this.formatter.getData()))

        app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
    }

    graph(){

    }
}
