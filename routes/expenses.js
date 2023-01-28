var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const Expenses = require('../models/expenses.model');
const {assign} = require('../commons/database/methods/gen-reflect')
const createAuth = require('../middlewares/auth');
var router = express.Router();

const expensesRepository = new GenRepository(Expenses);

const getList = async function(req, res) {  
  const data = await expensesRepository.find(req.query);
  res.json(data);
};

const insertExpenses = async function(req, res) {
  const body = assign(Expenses,req.body)
  await expensesRepository.insert([body]);
  res.json({message: "Expenses created"});
}
const updateExpenses = async function(req, res) {
  const body = assign(Expenses,req.body, 'updateSchemaDto')
  await expensesRepository.update(body);
  res.json({message: "Expenses updated"});
}
const deleteExpenses = async function (req, res) {
  await expensesRepository.delete(req.params.id);
  res.json({message: "Expenses deleted"});
}
router.get('',createAuth([3]), createRouteCallback(getList));
router.post('',createAuth([3]),createBodySchemaParser(Expenses), createRouteCallback(insertExpenses));
router.delete('/:id',createAuth([3]), createRouteCallback(deleteExpenses));
router.patch('',createAuth([3]),createBodySchemaParser(Expenses, 'updateSchemaDto'), createRouteCallback(updateExpenses));

module.exports = router;