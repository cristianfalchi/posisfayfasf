import { formatCustomers, formatSales, formatStock } from "../database";

export const getData = async () => {
    try {
        const [customersSinFormato, salesSinFormato, stockSinFormato] = await Promise.all([
            global.customer.findAll({ where: { informado: 'N' } }),
            global.sale.findAll({ where: { informado: 'N' } }),
            global.stock.findAll({ where: { informado: 'N' } })
        ])

        // option = 1 identifica que a las ventas al valor de totalPacksAmount se le coloca un '_' al inicio de
        // para que luego coincida con el patron de expresion regular y poder modificar el json

        const customer = formatCustomers(customersSinFormato);
        const sales = formatSales(salesSinFormato, 1);
        const stock = formatStock(stockSinFormato);

        // retorno el JSON segun documentacion de API
        return { customer, sales, stock };

    } catch (error) {
        console.log(error);
    }
}

