var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const Car = require('../models/car.model');
const {assign} = require('../commons/database/methods/gen-reflect');
const { ObjectID } = require('bson');
const Constant = require('../models/constant.model');
const CarService = require('../services/car.service');
const CustomError = require('../errors/custom-error');
var router = express.Router();

const carRepository = new GenRepository(Car);  

const getListForCustomer = async function(req, res) {  
  const params = req.query;
  if(!params.filter) params.filter = [];

  //TODO: uncomment the following
  // params.filter.push({
  //   column: 'userId',
  //   type: 'string',
  //   value: ObjectID(req.currentUser._id),
  //   comparator: '='
  // })
  console.log(req.query)
  const data = await carRepository.find(params);
  res.json(data);
};
const getListForAdmin = async function(req, res) {  
  const data = await carRepository.find(req.query);
  res.json(data);
};

const insertCar = async function(req, res) {
  req.body.status = 0;
  req.body.registrationDate = new Date();
  await carRepository.insert([req.body]);
  res.json({message: "Car created"});
}
const updateCar = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}
const updateCarRepairsProgression = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}
const deleteCar = async function (req, res) {
  await carRepository.delete(req.params.id);
  res.json({message: "Car deleted"});
}
const depositCar = async function(req, res) { 
  req.body.status = 1;
  const car = await CarService.findCoreCarById(req.body._id);
  console.log(car);
  if(car.status != 0) throw new CustomError(`La voiture ${car.numberPlate} n'est pas en circulation`);
  await carRepository.update(req.body);
  res.json({message: "Voiture deposee en attente de validation"});
}
const addCurrentRepair = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}
const getCurrentRepairToValid = async function(req, res) {  
  req.query.filter = [
    {column: 'currentRepair' , value:true, comparator: 'exists'},
    {column: 'currentRepair.status' , value:Constant.status.created, comparator: '='},
  ];
  const data = await carRepository.find(req.query);
  res.json(data);
};
const validPaiement = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}
const getCurrentRepairByCarAtelier = async function(req, res) {  
  req.query.filter = [
    {column: '_id' , value:ObjectID(req.query.id), comparator: '='}
  ];
  const data = await carRepository.find(req.query);
  res.json(data);
};
const getCurrentRepairByCarClient = async function(req, res) {  
  req.query.filter = [
    {column: '_id' , value:ObjectID(req.query.id), comparator: '='}
  ];
  const data = await carRepository.find(req.query);
  res.json(data);
};
const getRepairsAtelier = async function(req, res) {  
  req.query.filter = [
    {column: 'currentRepair' , value:true, comparator: 'exists'},
    {column: 'currentRepair.status' , value:Constant.status.validated, comparator: '='},
  ];
  const data = await carRepository.find(req.query);
  res.json(data);
};

const testBodyParser = async function (req, res){
  
  console.log(req.body);
  console.log(assign(Car, req.body));
  res.json({message: "Done"});
}

router.delete('/:id', createRouteCallback(deleteCar));
router.patch('',createBodySchemaParser(Car, 'updateSchemaDto'), createRouteCallback(updateCar));


router.get('/customer', createRouteCallback(getListForCustomer));
router.get('/to-receive', createRouteCallback(getListForAdmin));
router.post('',createBodySchemaParser(Car), createRouteCallback(insertCar));



router.patch('/deposit',createBodySchemaParser(Car, 'depositDto'), createRouteCallback(depositCar));
router.patch('/add_current_repair',createBodySchemaParser(Car, 'repairUpdateDto'), createRouteCallback(addCurrentRepair));

router.patch('/repairs_progression', createRouteCallback(updateCarRepairsProgression));
router.get('/current_repair_to_valid', createRouteCallback(getCurrentRepairToValid));
router.patch('/valid_paiement', createRouteCallback(validPaiement));
router.get('/atelier/current_repair', createRouteCallback(getCurrentRepairByCarAtelier));
router.get('/client/current_repair', createRouteCallback(getCurrentRepairByCarClient));
router.get('/atelier/repair', createRouteCallback(getRepairsAtelier));

router.post('/test-body-parser',createBodySchemaParser(Car), createRouteCallback(testBodyParser));

module.exports = router;