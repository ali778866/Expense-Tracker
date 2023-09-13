const express = require('express');

const expenseController = require('../controller/expense');

const router  = express.Router();

router.post('/add-expense', expenseController.postExpense);

router.get('/get-expense', expenseController.getExpense);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;