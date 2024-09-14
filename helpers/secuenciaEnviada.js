

export const secuenciaEnviada = async () => {

    try {
        const { informado } = (await global.info_secuencia.findOne(
            {
                order: [
                    ['num_secuencia', 'DESC']
                ]
            })).dataValues;

        if (informado == 'S') return true
        else
            return false;
    }
    catch (error) {
        throw new Error(error)
    }
}