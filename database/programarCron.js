import { cronTask } from "../cron/cronTask";
import { dias } from "../helpers";
import { inicializarBD } from "./inicializarBD";

export const programarCron = () => {
    inicializarBD().then(() => {
        global.programado.findOne() // Busco el registro actual de la hora programada
            .then(async (data) => {
                const { Hora, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo } = data.dataValues;
                const estadoDeLosDias = new Array(Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo);
                const newArrayDias = []; // Para guardar los dias que estan configurados en 'on'
                let i = 0;
                estadoDeLosDias.map(estado => {
                    if (estado == 'on') {
                        newArrayDias.push(dias[i]);
                    }
                    i++;
                })
                // Ejecuto el cron con la hora y los dias programados
                await cronTask(Hora, newArrayDias);

            });
    });
} 