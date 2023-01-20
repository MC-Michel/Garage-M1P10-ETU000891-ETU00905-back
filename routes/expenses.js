var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const Expenses = require('../models/expenses.model');
const {assign} = require('../commons/database/methods/gen-reflect')
var router = express.Router();

const expensesRepository = new GenRepository(Expenses);

const getList = async function(req, res) {  
  const data = await expensesRepository.find(req.query);
  res.json(data);
};

const insertExpenses = async function(req, res) {
  await expensesRepository.insert([req.body]);
  res.json({message: "Expenses created"});
}
const updateExpenses = async function(req, res) {
  await expensesRepository.update(req.body);
  res.json({message: "Expenses updated"});
}
const deleteExpenses = async function (req, res) {
  await expensesRepository.delete(req.params.id);
  res.json({message: "Expenses deleted"});
}
router.get('', createRouteCallback(getList));
router.post('', createRouteCallback(insertExpenses));
router.delete('/:id', createRouteCallback(deleteExpenses));
router.patch('', createRouteCallback(updateExpenses));

module.exports = router;