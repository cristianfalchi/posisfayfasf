import { response } from "express";
const fs = require("fs");
import { formatCustomers, formatHistorial, formatSales, formatStock, programarCron, updateDataDB } from '../database'
import { fetchData, getStatusMessage, intialState, getJson, substractHours, addHours } from '../helpers'


// CLIENTES
export const clientes = async (req, res = response) => {

    const displayName = req.displayName;
    const page = parseInt(req.query.page) || 1;
    const size = 20;

    try {

        const { count, rows } = await global.customer.findAndCountAll({ where: { informado: 'N' } });
        const movementA = await global.customer.findAndCountAll({ where: { informado: 'N', movementCode: 'A' } });
        const movementB = await global.customer.findAndCountAll({ where: { informado: 'N', movementCode: 'B' } });
        const movementM = await global.customer.findAndCountAll({ where: { informado: 'N', movementCode: 'M' } });
        const { num_secuencia } = await global.info_secuencia.findOne({ where: { informado: 'N' } }) || { num_secuencia: '' };

        const cantPaginas = Math.ceil(count / size);

        const rowsSinFormato = rows.slice((page - 1) * size, (page) * (size));
        const customers = formatCustomers(rowsSinFormato);

        res.render('customers', { customers, num_secuencia, displayName, size, page, cantPaginas, count, countMovA: movementA.count, countMovB: movementB.count, countMovM: movementM.count });

    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }

}

// VENTAS
export const ventas = async (req, res = response) => {

    const displayName = req.displayName;
    const page = parseInt(req.query.page) || 1;
    const size = 20;
    try {

        const { cant_paquetes, cant_facturas, monto_venta } = await global.info_secuencia.findOne({ where: { informado: 'N' } }) || { cant_paquetes: 0, cant_facturas: 0, monto_venta: 0 };

        const { count, rows } = await global.sale.findAndCountAll({
            where: { informado: 'N' },
        });

        const cantPaginas = Math.ceil(count / size);

        const salesSinFormato = rows.slice((page - 1)*size, (page) * (size) ); 
        const sales = formatSales(salesSinFormato);

        res.render('sales', { sales, cant_paquetes, cant_facturas, monto_venta, displayName, size, page, cantPaginas });

    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }


}

// STOCK
export const stock = async (req, res = response) => {

    const displayName = req.displayName;
    const page = parseInt(req.query.page) || 1;
    const size = 20;

    try {
        const {count, rows}  = await global.stock.findAndCountAll({
            where: { informado: 'N' },
      });
        const cantPaginas = Math.ceil(count/size); 

        const rowsSinFormato = rows.slice((page - 1)*size, (page) * (size) );
        const stock = formatStock(rowsSinFormato);

        res.render('stock', { stock, displayName,count, size, page, cantPaginas });

    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }

}

// HISTORIAL DE SECUENCIAS ENVIADAS
export const historial = async (req, res = response) => {

    const displayName = req.displayName;
    const page = parseInt(req.query.page) || 1;
    const size = 20;

    try {
        const {count, rows}  = await global.info_secuencia.findAndCountAll({
            order: [
                ['num_secuencia', 'DESC']
            ],
         });
         const cantPaginas = Math.ceil(count/size); 
    
         const rowsSinFormato = rows.slice((page - 1)*size, (page) * (size) ); 
         const historial = formatHistorial(rowsSinFormato);
    
            res.render('historial', { historial, displayName, size, page, cantPaginas});


    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }
}

// ACTUALIZAR/RECRAGAR SECUENCIA
export const actualizar = async (req, res = response) => {

    await intialState();
    res.redirect('/');

}

// VISTA DE DESCARGAR SECUENCIA
export const descargar = async (req, res = response) => {

    const displayName = req.displayName;

    res.render('descargar', { descargar: true, displayName });

}

// OBTENER FORMULARIO PROGRAMAR ENVIO
export const getFormProgramar = async (req, res = response) => {

    const displayName = req.displayName;
    let { Hora, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo } = (await global.programado.findOne()).dataValues;
    Hora = substractHours(Hora);
    res.render('programar', {
        programar: true, displayName, data: {
            Hora,
            Lunes,
            Martes,
            Miercoles,
            Jueves,
            Viernes,
            Sabado,
            Domingo
        },
        hiden: true
    });
}
// RECIBO LOS DATOS DEL FORMULARIO PROGRAMAR ENVIO
export const postFormProgramar = async (req, res = response) => {
    const displayName = req.displayName;

    const { Hora, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo } = req.body;
    let message = '';
    let msgType = ''

    let Lun = (Lunes == undefined) ? 'off' : 'on';
    let Mar = (Martes == undefined) ? 'off' : 'on';
    let Mier = (Miercoles == undefined) ? 'off' : 'on';
    let Juev = (Jueves == undefined) ? 'off' : 'on';
    let Vier = (Viernes == undefined) ? 'off' : 'on';
    let Sab = (Sabado == undefined) ? 'off' : 'on';
    let Dom = (Domingo == undefined) ? 'off' : 'on';

    try {
        if (Hora !== '') { // PROGRAMAR

            if (Lun == 'off' && Mar == 'off' && Mier == 'off' && Juev == 'off' && Vier == 'off' && Sab == 'off' && Dom == 'off') {
                message = "Debe seleccionar al menos un día";
                msgType = 'danger';
                throw new Error();
            } else {

                await global.programado.update(
                    {
                        Hora: addHours(Hora),
                        Lunes: Lun,
                        Martes: Mar,
                        Miercoles: Mier,
                        Jueves: Juev,
                        Viernes: Vier,
                        Sabado: Sab,
                        Domingo: Dom
                    }, {
                    where: {}
                });

                global.task?.stop();
                programarCron();
                message = "La hora ha sido programada con éxito";
                msgType = 'success';
            }
        } else { //DESPROGRAMAR
            global.task?.stop();
            await global.programado.update(
                {
                    Hora: '--:--:--',
                    Lunes: Lun,
                    Martes: Mar,
                    Miercoles: Mier,
                    Jueves: Juev,
                    Viernes: Vier,
                    Sabado: Sab,
                    Domingo: Dom
                }, {
                where: {}
            }
            );
            message = "Se ha desprogramado la hora con éxito";
            msgType = 'success';
        }

        res.render('programar', {
            programar: true, displayName, data: {
                Hora,
                Lunes: Lun,
                Martes: Mar,
                Miercoles: Mier,
                Jueves: Juev,
                Viernes: Vier,
                Sabado: Sab,
                Domingo: Dom
            },
            message, msgType
        });

    } catch (error) {
        console.log(error);
        res.render('programar', {
            programar: true, displayName, data: {
                Hora,
                Lunes: Lun,
                Martes: Mar,
                Miercoles: Mier,
                Jueves: Juev,
                Viernes: Vier,
                Sabado: Sab,
                Domingo: Dom
            },
            message, msgType
        });
    }


}

// DESCARGAR LA SECUENCIA
export const descargarSecuencia = async (req, res = response) => {

    const { nroSec } = req.query;
    const json = await getJson(nroSec);
    res.send(json);

}

// VISTA DE REHABILITAR SECUENCIA
export const getFormRehabilitar = async (req, res = response) => {

    const displayName = req.displayName;
    const { num_secuencia } = await global.info_secuencia.findOne({ where: { informado: 'N' } }) || { num_secuencia: '' };

    res.render('rehabilitar', { rehabilitar: true, nroSec: num_secuencia, displayName });
}

// REHABILITAR SECUENCIA
export const rehabilitarSecuencia = async (req, res = response) => {

    const displayName = req.displayName;
    const { nroSecIngresado } = req.body;

    try {

        // Primero compruebo que no haya una secuencia ya habilitada
        const secuenciaHabilitada = (await global.info_secuencia.findOne({ where: { informado: 'N' } }));
       
        if (secuenciaHabilitada) {
            return res.render('rehabilitar', { rehabilitar: true, existeSecHabilitada: true, nroSecIngresado, displayName });
        }

        // Segundo compruebo que la secuencia existe y obtengo la fecha de la misma
        const secuencia = (await global.info_secuencia.findOne({ where: { num_secuencia: nroSecIngresado } }));

        // Si la secuencia no existe
        if (!secuencia)
            return res.render('rehabilitar', { rehabilitar: true, noExisteSec: true, secHabilitada:false, nroSecIngresado, displayName });

        // obtengo la fecha de la secuencia
        const fecha = secuencia.dataValues.fecha; // ejemplo 2024-08-04

        // Actualizo la tabla parametro
        await global.parametro.update({
            NumSecuenciaP: nroSecIngresado,
            FechaSecuenciaP: fecha,
            Informado: 'N'
        }, {
            where: {
                Cuit: process.env.CUIT_EMPRESA
            }
        })

        // Actualizo las tablas customer, sale y stock
        await global.customer.update({ Informado: 'N' }, { where: { Secuencia: nroSecIngresado } });
        await global.sale.update({ Informado: 'N' }, { where: { sequenceNumber: nroSecIngresado } });
        await global.stock.update({ Informado: 'N' }, { where: { sequenceNumber: nroSecIngresado } });

        await global.info_secuencia.destroy({where: {num_secuencia: nroSecIngresado}});

        await intialState();
        return res.redirect('/home');
        // return res.render('rehabilitar', { rehabilitar: true, secHabilitada: true, noExisteSec: false, nroSecIngresado, displayName });

    } catch (error) {
        console.log("Ha ocurrido un Problema al actualizar la Base de Datos. Consulte con el administrador de la misma.");
        throw new Error(error);
    }
}

// DESHABILITAR SECUENCIA
export const deshabilitarSecuencia = async (req, res = response) => {
    
    const displayName = req.displayName;
    updateDataDB();

    const message = 'No hay SECUENCIA pendiente de enviar.'
    const msgType = 'info'

    
    return res.render('index', { sec_deshabilitada: true, message, msgType, displayName });

}

// ENVIAR DATA
export const enviar = async (req, res = response) => {

    const displayName = req.displayName;
    let { NumSecuenciaP } = await global.parametro.findOne();
    let { informado } = await global.info_secuencia.findOne({ where: { num_secuencia: NumSecuenciaP } }) || 'N';

    if (informado === 'S') {
        return res.redirect('/');
    }

    try {

        const [customersSinFormato, salesSinFormato, stockSinFormato] = await Promise.all([
            global.customer.findAll({ where: { informado: 'N' } }),
            global.sale.findAll({ where: { informado: 'N' } }),
            global.stock.findAll({ where: { informado: 'N' } })
        ])

        // option = 1 identifica que a las ventas al valor de totalPacksAmount se le coloca un '_' al inicio de
        // para que luego coincida con el patron de expresion regular y poder modificar el json

        const customer = formatCustomers(customersSinFormato);
        let sales = formatSales(salesSinFormato, 1);
        const stock = formatStock(stockSinFormato);

        // Genero el JSON segun documentacion de API
        let data = { customer, sales, stock };

        // Genero el archivo JSON jsonData.json
        // let data_json = JSON.stringify(data);
        // const regex = /"_(-|)([0-9]+(?:\.[0-9]+)?)"/g
        // data_json = data_json.replace(regex, '$1$2')
        // fs.writeFileSync('jsonData.json', data_json);

        // Envio los datos de la secuencia y verifico la respuesta
        const response = await fetchData(data, NumSecuenciaP);
        const result = await response.json();

        // Invalid Client 
        if (result.error) {
            throw new Error(result.error);
        }

        // verifico el estado de mensaje de la respuesta
        const message = getStatusMessage(result);

        if (message.msgType === 'success') {
            updateDataDB();

            message.message = 'No hay SECUENCIA pendiente de enviar.'
            message.msgType = 'info'

            return res.render('index', { alert: true, ...message, displayName });
        }

        return res.render('index', { ...message, displayName });

    } catch (error) {
        console.log(error);
        res.render('index', { message: error.message, msgType: 'danger', displayName });
    }

}