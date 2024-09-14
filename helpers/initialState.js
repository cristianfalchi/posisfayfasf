

import { inicializarBD } from "../database";

export const intialState = async () => {

    try {
         // Inicializo las instancias de BD si es que no estan aun inicializadas
        await inicializarBD();
        const { NumSecuenciaP, FechaSecuenciaP, Informado } = (await global.parametro.findOne()).dataValues;
        const existeEnInfoSecuencia = await global.info_secuencia.findOne({ where: { num_secuencia: NumSecuenciaP }});

        if (!existeEnInfoSecuencia) { // si no existe en la tabla
            console.log("-------------------------------------------------------------------------");
            console.log("No Existe secuencia en info_secuencia");
            console.log("-------------------------------------------------------------------------");
            await global.info_secuencia.create({
                num_secuencia: NumSecuenciaP,
                fecha: FechaSecuenciaP,
                informado: 'N',
                cant_clientes: await global.customer.count({ where: { informado: 'N' } }),
                monto_venta: await global.sale.sum('totalPacksAmount', { where: { informado: 'N' } }) || 0,
                cant_facturas: await global.sale.count({ where: { informado: 'N' } }) || 0,
                cant_paquetes: await global.sale.sum('quantityOfPacks', { where: { informado: 'N' } }) || 0
            })

            await global.customer.update({ secuencia: NumSecuenciaP }, { where: { informado: 'N' } })
        }else {
             if(Informado !== (await global.info_secuencia.findOne({ where: { num_secuencia: NumSecuenciaP }})).dataValues.informado){
                await global.info_secuencia.destroy({ where: {num_secuencia: NumSecuenciaP}});
                await intialState();
             }
        }

    } catch (error) {
        console.log(error);
        console.log("Ha ocurrido un problema al leer la base de datos. Consulte con el administrador de la misma.");        
    }
   
};
