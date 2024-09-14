

export const updateDataDB = async () => {
    try {
        const { set, where } = { set: { Informado: 'S' }, where: { where: { Informado: 'N' } } };
        await global.customer.update(set, where);
        await global.sale.update(set, where);
        await global.stock.update(set, where);
        await global.parametro.update(set, where);
        await global.info_secuencia.update({ informado: 'S' }, { where: { informado: 'N' } });    
    } catch (error) {
        console.log("Ha ocurrido un Problema al actualizar la Base de Datos. Consulte con el administrador de la misma.");
        throw new Error(error);
    }
    
}