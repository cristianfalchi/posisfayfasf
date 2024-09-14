const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = {
    host: process.env.HOST_NAME_SF || "localhost",
    user: process.env.USER_NAME_SF || "root",
    password: process.env.PASSWORD_SF || "root",
    database: process.env.DATABASE_SF || "posis_mg",
}


export const sequelizeConnection = async() => {
    return new Sequelize(db.database, db.user, db.password, {
        host: db.host,
        dialect: 'mysql'
    });
}
