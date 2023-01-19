var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const Car = require('../models/car.model');
const {assign} = require('../commons/database/methods/gen-reflect')
var router = express.Router();

const carRepository = new GenRepository(Car);

const getList = async function(req, res) {  
  const data = await carRepository.find(req.query);
  res.json(data);
};

const insertCar = async function(req, res) {
  await carRepository.insert([req.body]);
  res.json({message: "Car created"});
}
const updateCar = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}
const deleteCar = async function (req, res) {
  await carRepository.delete(req.params.id);
  res.json({message: "Car deleted"});
}
const depositCar = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car deposited"});
}
const addCurrentRepair = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}
const getCurrentRepairToValid = async function(req, res) {  
  const data = await carRepository.find(req.query);
  res.json(data);
};
const validPaiement = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}

const testBodyParser = async function (req, res){
  
  console.log(req.body);
  console.log(assign(Car, req.body));
  res.json({message: "Done"});
}
router.get('', createRouteCallback(getList));
router.post('', createRouteCallback(insertCar));
router.delete('/:id', createRouteCallback(deleteCar));
router.patch('', createRouteCallback(updateCar));
router.patch('/deposit', createRouteCallback(depositCar));
router.patch('/add_current_repair', createRouteCallback(addCurrentRepair));
router.get('/current_repair_to_valid', createRouteCallback(getCurrentRepairToValid));
router.patch('/valid_paiement', createRouteCallback(validPaiement));

router.post('/test-body-parser',createBodySchemaParser(Car), createRouteCallback(testBodyParser));

module.exports = router;