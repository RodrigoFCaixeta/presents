const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'EiTI4U7vZK3o', {
  host: '200.155.71.116',
  port: 32708,
  dialect: 'postgres',
});

module.exports = sequelize;
