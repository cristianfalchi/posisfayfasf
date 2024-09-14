const { Router } = require('express');
const { clientes, ventas, stock, historial, actualizar,descargar, descargarSecuencia, enviar, getFormProgramar, postFormProgramar,getFormRehabilitar,rehabilitarSecuencia, deshabilitarSecuencia } = require('../controllers/data');
const { authentication } = require('../middleware/authentication');
const { home } = require('../controllers/home');
const router = new Router();

router.get('/home', authentication, home);

router.get('/clientes', authentication, clientes);

router.get('/ventas', authentication, ventas);
router.get('/stock', authentication, stock);
router.get('/historial', authentication, historial);

router.get('/actualizar', authentication, actualizar);
router.get('/enviar', authentication, enviar);

router.get('/descargar', authentication, descargar); // muestra la vista para descargar
router.get('/descargar-secuencia', authentication, descargarSecuencia);
router.get('/programar', authentication, getFormProgramar);
router.post('/programar', authentication, postFormProgramar);
router.get('/rehabilitar', authentication, getFormRehabilitar);
router.post('/rehabilitar-secuencia', authentication, rehabilitarSecuencia);
router.get('/deshabilitar-secuencia', authentication, deshabilitarSecuencia);

module.exports = router;