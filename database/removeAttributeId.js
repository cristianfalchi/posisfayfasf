
export const removeAttributeId = async () => {
    global.customer.removeAttribute('id');
    global.info_secuencia.removeAttribute('id');
    global.parametro.removeAttribute('id');
    global.sale.removeAttribute('id');
    global.stock.removeAttribute('id');
    global.programado.removeAttribute('id');
}