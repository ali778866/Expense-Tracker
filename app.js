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
const leaderboardRoutes = require('./routes/leaderboard')
const resetPassword =require('./routes/forgotpassword')

const Forgotpassword = require('./model/forgot')
const Expense = require('./model/expense')
const User = require('./model/user')
const Order = require('./model/order')
const Url = require('./model/downloadURL')

const staticPath = path.join(__dirname, "./view")

app.use(express.static(staticPath));
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', leaderboardRoutes)
app.use('/password', resetPassword)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Url);
Url.belongsTo(User);

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        app.listen(4500);
    })
    .catch(err => console.log(err))