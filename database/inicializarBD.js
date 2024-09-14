import { Customer, Info_Secuencia, Parametro, Sale, Stock, Programado } from "../models";
import { removeAttributeId, sequelizeConnection } from ".";

// Inicializo variables globales correspondientes a la base de datos
export const inicializarBD = async () => {
    try {

        // Si no hay una instancia de base de datos creada, la inicializo.
        if (!global.sequelize) {
            console.log("-------------------------------------------------------------------------");
            console.log("Vamos a crear una instancia de Sequelize e inicializar todos los modelos");
            console.log("-------------------------------------------------------------------------");
            global.sequelize = await sequelizeConnection();
            global.info_secuencia = Info_Secuencia();
            global.customer = Customer();
            global.parametro = Parametro();
            global.sale = Sale();
            global.stock = Stock();
            global.programado = Programado();
            await removeAttributeId();
        } else {
            console.log("-------------------------------------------------------------------------");
            console.log("Ya existe una intancia de Sequelize");
            console.log("-------------------------------------------------------------------------");
        }

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}