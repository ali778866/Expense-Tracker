const Expense = require('../model/expense');
const User = require('../model/user');

exports.usertotalexp = async (req, res, next) => {
    try{
        const users = await User.findAll()  
        const expenses = await Expense.findAll();
        const userAggregatedExp = {};
        expenses.forEach(expense => {
            const { userId, amount } = expense;
            // console.log(typeof(amount));
            if(userAggregatedExp[userId]){
                userAggregatedExp[userId] += parseInt(amount);
            } else {
                userAggregatedExp[userId] = parseInt(amount);
            }   
        });
        var userLeaderboardDetails = [];
        users.forEach((user) => {
             userLeaderboardDetails.push({ name: user.name, totalExpense: userAggregatedExp[user.id] || 0})
        })
        userLeaderboardDetails.sort((a,b) =>  b.totalExpense - a.totalExpense);
        console.log(userLeaderboardDetails);
        res.status(200).json(userLeaderboardDetails);
        } catch(err){
            console.error("Error adding user:", err);
            res.status(500).json({
                error: err.message
                
            })
        }
}