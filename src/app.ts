import {serverSetup} from './setupServeur';
import { databaseSetup } from './setupDatabase';


async function init () {
    await serverSetup();
    await databaseSetup();
}

init();