var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const Repair = require('../models/repair.model');
const {assign} = require('../commons/database/methods/gen-reflect')
var router = express.Router();

const repairRepository = new GenRepository(Repair);

const getList = async function(req, res) {  
  const data = await repairRepository.find(req.query);
  res.json(data);
};

const insertRepair = async function(req, res) {
  await repairRepository.insert([req.body]);
  res.json({message: "Repair created"});
}
const updateRepair = async function(req, res) {
  await repairRepository.update(req.body);
  res.json({message: "Repair updated"});
}
const deleteRepair = async function (req, res) {
  await repairRepository.delete(req.params.id);
  res.json({message: "Repair deleted"});
}
const testBodyParser = async function (req, res){
  
  console.log(req.body);
  console.log(assign(Repair, req.body));
  res.json({message: "Done"});
}
router.get('', createRouteCallback(getList));
router.post('', createRouteCallback(insertRepair));
router.delete('/:id', createRouteCallback(deleteRepair));
router.patch('', createRouteCallback(updateRepair));

router.post('/test-body-parser',createBodySchemaParser(Repair), createRouteCallback(testBodyParser));

module.exports = router;