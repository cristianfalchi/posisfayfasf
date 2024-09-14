const { DataTypes } = require('sequelize');

export const Programado = () => global.sequelize.define('Programado', {
    
    Hora: DataTypes.STRING,
    Lunes: DataTypes.STRING,
    Martes: DataTypes.STRING,
    Miercoles: DataTypes.STRING,
    Jueves: DataTypes.STRING,
    Viernes: DataTypes.STRING,
    Sabado: DataTypes.STRING,
    Domingo: DataTypes.STRING,

}, {
    tableName: 'programado',
    timestamps: false

});
