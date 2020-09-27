import express from 'express';
import cors from 'cors';
import { D3Formatter } from './dynamicData';
import { Store } from '../store';

export class WebServer {
    private formatter: D3Formatter;
    constructor(private store: Store) {
        this.formatter = new D3Formatter(this.store);
    }

    run() {
        const app = express()
        const port = 80

        app.use(cors());
        const nodes = this.store.allNodes();
        const edges = this.store.allEdges();
        app.get('/', (req, res) => res.send(this.formatter.getData()))

        app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
    }
}
