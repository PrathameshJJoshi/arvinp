const Sequelize = require('sequelize');


const db="arvinp";
const username="root";
const password="";
const host="localhost"

module.exports =  new Sequelize(db,username,password, {
  host: host,
  // port:3306,
  dialect: 'mariadb',
  // operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});