import {serverSetup} from './setupServeur';


async function init () {
    await serverSetup();
}

init();