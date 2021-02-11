const Sequelize = require('sequelize');
// const base = require('react-native-base64')
const db = require('../config/database');

const pwork = db.define('pwork', {
  user_id: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATEONLY
  },
  name: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
});



pwork.sync().then(() => {
  console.log('table created');
});
module.exports = pwork;
