const { DataTypes } = require('sequelize');

export const Stock =  () => global.sequelize.define('Stock', {

    sequenceNumber: DataTypes.NUMBER,
    EZDCode: DataTypes.STRING,
    branchCode: DataTypes.STRING,
    stockDate: DataTypes.STRING,
    product: DataTypes.STRING,
    shipToCode: DataTypes.STRING,
    quantityOfPacks: DataTypes.NUMBER,
    Informado: DataTypes.STRING,

}, {
    tableName: 'stock',
    timestamps: false
});