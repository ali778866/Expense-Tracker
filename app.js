const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utility/database')

const app = express();

app.use(bodyParser.json({ extended: false }));

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')

const staticPath = path.join(__dirname, "./view")

app.use(express.static(staticPath));
app.use(userRoutes);
app.use('/expense', expenseRoutes)

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        app.listen(4500);
    })
    .catch(err => console.log(err))