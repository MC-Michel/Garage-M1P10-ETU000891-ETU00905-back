var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const DefaultRepair = require('../models/default-repairs.model');
var router = express.Router();

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

router.delete('/:id', createRouteCallback(deleteDefaultRepair));
router.patch('',createBodySchemaParser(DefaultRepair, 'updateSchemaDto'), createRouteCallback(update));


router.get('/customer', createRouteCallback(getListForCustomer));
router.get('/admin', createRouteCallback(getListForAdmin));
router.post('',createBodySchemaParser(DefaultRepair), createRouteCallback(insert));

module.exports = router;