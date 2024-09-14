const cron = require('node-cron');
import { cronSendData } from './cronSendData';

export const cronTask = async (hora, dias) => {
    // hora = '12:00:00' o '--:--:--'
    if (hora !== '--:--:--' && dias.length > 0) {

        console.log(`${hora.split(':')[1]} ${hora.split(':')[0]} * * ${dias.join()}`);
        global.task = cron.schedule(`${hora.split(':')[1]} ${hora.split(':')[0]} * * ${dias.join()}`, async () => {

            await cronSendData();

        }, { scheduled: false })

        global.task.start();
    }
}