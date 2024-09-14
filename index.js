
const cron = require('node-cron');
require('dotenv').config();
import { programarCron } from './database';
import Server from './models/server';


// Variable global que representa a la Empresa elegida por el usuario
global.sequelize;
global.info_secuencia;
global.customer;
global.parametro;
global.sale;
global.stock;
global.programado;
global.task;
const server = new Server();

server.listen();

// Incializo los modelos de la base de datos para leer de la tabla programado y configurar el cron
programarCron();



