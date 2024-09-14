import { getAuth } from "firebase/auth";
import { updateDataDB } from "../database";
import { intialState, getData, secuenciaEnviada, fetchData, getStatusMessage } from "../helpers";

export const cronSendData = async () => {

    try {

        await intialState();
        // Si la secuencia no esta enviada
        if (!(await secuenciaEnviada())) {

            console.log("Hay secuencia por enviar");
            const data = await getData(); // Genero el JSON segun documentacion de API

            // Envío la data
            console.log("-------------------------------------------------------------------------");
            console.log("Numero de secuencia: ", data.sales[0].sequenceNumber);
            console.log("-------------------------------------------------------------------------");
            const response = await fetchData(data, data.sales[0].sequenceNumber);
            const result = await response.json();

            // Invalid Client 
            if (result.error) {
                throw new Error(result.error);
            }

            // verifico el estado de mensaje de la respuesta
            const message = getStatusMessage(result);

            // Actualiza la base de datos
            if (message.msgType === 'success') {
                await updateDataDB();
            }

            const auth = getAuth();
            if (!auth.currentUser) {
                // Una vez sequelize.close()que se ha llamado, es imposible abrir una nueva conexión. 
                // Deberá crear una nueva instancia de Sequelize para acceder nuevamente a su base de datos.
                console.log("-------------------------------------------------------------------------");
                console.log("No hay un Usuario autenticado");
                console.log("-------------------------------------------------------------------------");
                global.sequelize.close();
                global.sequelize = undefined;
            }

        } else {
            console.log("-------------------------------------------------------------------------");
            console.log("No hay secuencia para enviar");
            console.log("-------------------------------------------------------------------------");

        }

    } catch (error) {
        console.log(error);
        console.log("-------------------------------------------------------------------------");
        console.log("Erro con el envío de la Data");
        console.log("-------------------------------------------------------------------------");
        throw new Error(error);


    }

}