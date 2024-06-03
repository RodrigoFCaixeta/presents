const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Present = sequelize.define('call_test', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'call_test',
  timestamps: false,
});

module.exports = Present;
