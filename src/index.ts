import { Scenario } from './simulations/scenario';
import { Store } from './store';
import { Scenario1 } from './simulations/scenario1';
import { WebServer } from './web';
import { D3Formatter } from './web/dynamicData';


const store = new Store();
const d3Formatter = new D3Formatter(store);
const server = new WebServer(d3Formatter);
server.run();
const scenario = new Scenario1(store);
scenario.start();        
