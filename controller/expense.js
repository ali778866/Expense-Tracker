const Expense = require('../model/expense');
const User = require('../model/user');

exports.postExpense = async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const userId = req.body.userId
        const category = req.body.category;

        await Expense.create({ amount: amount, description: description, category: category, userId: userId })
            .then(expense => {
                const totalExpense = Number(req.user.totalExpenses) + Number(amount)
                User.update({ totalExpenses: totalExpense }, { where: { id: userId } })
            })
            .then(() => {
                res.status(201).json({ addExpense: expense });
            })
            .catch(err => console.log(err))

    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({
            error: err.message

        })
    }
}

exports.getExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ allExpense: expenses });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({
            error: err.message

        })
    }
}

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    await Expense.destroy({ where: { id: id } });
    res.sendStatus(204);
}