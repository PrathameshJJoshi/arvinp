const Sequelize = require('sequelize');
// const base = require('react-native-base64')
const db = require('../config/database');

const issue = db.define('issue', {
  user_id: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATEONLY
  },
  issue_type: {
    type:   Sequelize.ENUM,
    values: ['Water Issue ','Electricity Issue']
  },
  ward: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  mobile: {
    type: Sequelize.STRING
  },
  issues: {
    type: Sequelize.STRING
  },
});



issue.sync().then(() => {
  console.log('table created');
});
module.exports = issue;
