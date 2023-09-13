const Expense = require('../model/expense');

exports.postExpense = async (req, res, next) => {
    try{
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const data = await Expense.create({
            amount: amount, 
            description :  description ,
            category: category
        })
        res.status(200).json({expenseData: data})
    } catch { err => console.log(err) }
}

exports.getExpense = async (req, res, next) => {
    try{
        const expenses = await Expense.findAll();
        res.json({allExpenses: expenses })
    } catch { err => console.log(err) }
}

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    await Expense.destroy({where: {id: id}});
    res.sendStatus(204);
}