import { Scenario1 } from './simulation/scenario1';
import { WebServer } from './web';
import { Scenario2 } from './simulation/scenario2';


const scenario = new Scenario2();
scenario.start().then(() => {
    const server = new WebServer(scenario.getStore());
    server.run();
})
