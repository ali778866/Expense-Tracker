const Sequelize = require('sequelize');

const sequelize= require('../utility/database');

const Expense = sequelize.define('expense', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        amount: Sequelize.STRING,
        description: Sequelize.STRING,
        category: Sequelize.STRING
    })

module.exports = Expense;