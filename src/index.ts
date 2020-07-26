import { Scenario1 } from './simulation/scenario1';
import { WebServer } from './web';


const scenario = new Scenario1();
scenario.start();
const server = new WebServer(scenario.getStore());
server.run();