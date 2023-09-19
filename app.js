const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utility/database')

const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const Expense = require('./model/expense')
const User = require('./model/user')
const Order = require('./model/order')

const staticPath = path.join(__dirname, "./view")

app.use(express.static(staticPath));
app.use(userRoutes);
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        app.listen(4500);
    })
    .catch(err => console.log(err))