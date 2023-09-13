const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    'expense-tracker',
    'root',
    'Ali@9934',
    { dialect: 'mysql', host: 'localhost' }
)

module.exports = sequelize;