const Expense = require('../model/expense');
const User = require('../model/user');
const sequelize = require('../utility/database');

exports.usertotalexp = async (req, res, next) => {
    try{
        const leaderboardexp = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum' , sequelize.col('expenses.amount')), 'totalExpense']],
            include: [
                {
                    model: Expense,
                    attributes:[]
                }
            ],
            group: ['user.id']
        })  
        console.log(leaderboardexp);
        res.status(200).json(leaderboardexp);

        } catch(err){
            console.error("Error adding user:", err);
            res.status(500).json({
                error: err.message
                
            })
        }
}