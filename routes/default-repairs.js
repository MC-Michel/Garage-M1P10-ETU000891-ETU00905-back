var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const DefaultRepair = require('../models/default-repairs.model');
var router = express.Router();

const createAuth = require('../middlewares/auth');

const repository = new GenRepository(DefaultRepair);

const getListForCustomer = async function(req, res) {  
  const params = req.query;
  if(!params.filter) params.filter = [];
  const data = await repository.find(params);
  res.json(data);
};
const getListForAdmin = async function(req, res) {  
  const data = await repository.find(req.query);
  res.json(data);
};
const getById = async function (req, res){
  const defaultRepair = await repository.findById(req.params.id);
  if(defaultRepair == null) throw new CustomError(`Aucune réparation correspondante a l'id ${req.params.id}`);
  res.json(defaultRepair);
}
const getByIdAdmin = async function (req, res){
  const defaultRepair = await repository.findById(req.params.id);
  if(defaultRepair == null) throw new CustomError(`Aucune réparation correspondante a l'id ${req.params.id}`);
  res.json(defaultRepair);
}

const insert = async function(req, res) {
  req.body.status = 0;
  req.body.registrationDate = new Date();
  await repository.insert([req.body]);
  res.json({message: "Default repair created"});
}
const update = async function(req, res) {
  await repository.update(req.body);
  res.json({message: "Default repair updated"});
}
const deleteDefaultRepair = async function (req, res) {
  await repository.delete(req.params.id);
  res.json({message: "Default repair deleted"});
}

router.delete('/:id',createAuth([2,3]), createRouteCallback(deleteDefaultRepair));
router.patch('',createAuth([2,3]),createBodySchemaParser(DefaultRepair, 'updateSchemaDto'), createRouteCallback(update));


router.get('/customer', createAuth([1]), createRouteCallback(getListForCustomer));
router.get('/admin',createAuth([2,3]), createRouteCallback(getListForAdmin));
router.get('/customer/:id',createAuth([1]), createRouteCallback(getById));
router.get('/admin/:id',createAuth([2,3]), createRouteCallback(getByIdAdmin));
router.post('',createAuth([2,3]),createBodySchemaParser(DefaultRepair), createRouteCallback(insert));

module.exports = router;