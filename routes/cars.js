var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const Car = require('../models/car.model');
const RepairHistoric = require('../models/repair-historic.model');
const {assign} = require('../commons/database/methods/gen-reflect');
const { ObjectID, ObjectId } = require('bson');
const Constant = require('../models/constant.model');
const CarService = require('../services/car.service');
const CustomError = require('../errors/custom-error');
const createAuth = require('../middlewares/auth');
const CarRepository = require('../repositories/car.repo');
var router = express.Router();

const carRepository = new CarRepository();
const repairHistoricRepository = new GenRepository(RepairHistoric);  




const getListForCustomer = async function(req, res) {  
  const params = req.query;
  if(!params.filter) params.filter = [];
  params.filter.push({
    column: 'userId',
    type: 'string',
    value: ObjectID(req.currentUser._id),
    comparator: '='
  }) 
  const data = await CarService.findCoreCars(params);
  res.json(data);
};
const getListForAdmin = async function(req, res) {  
  const data = await CarService.findCoreCars(req.query);
  res.json(data);
};

const insertCar = async function(req, res) {
  req.body.status = Constant.carStatus.inCirculation;
  req.body.registrationDate = new Date();
  req.body.userId = req.currentUser._id;
  await carRepository.insert([req.body]);
  res.json({message: "Car created"});
}
const updateCar = async function(req, res) {
  const car = await CarService.findCoreCarById(req.body._id, {currentUser: req.currentUser, exists: true});
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}
const updateCarRepairsProgression = async function(req, res) {
  await carRepository.update(req.body);
  res.json({message: "Car updated"});
}
const deleteCarCustomer = async function (req, res) {
  const car = await CarService.findCoreCarById(req.params.id, {currentUser: req.currentUser, exists: true});
  await carRepository.softDelete(req.params.id);
  res.json({message: "Voiture retirée"});
}
const depositCar = async function(req, res) { 
  req.body.status = Constant.carStatus.deposited;
  const car = await CarService.findCoreCarById(req.body._id, {currentUser: req.currentUser, exists: true});
  await carRepository.update(req.body);
  res.json({message: "Voiture deposee en attente de validation"});
}

const getById = async function (req, res){
  const car = await CarService.findCoreCarById(req.params.id, {currentUser: req.currentUser, exists: true});
 
  res.json(car);
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
const generateExitSlip = async function(req, res) {
  let car = req.body;
  let repairHistoric = car.currentRepair;
  repairHistoric.carId = ObjectId(car._id);
  await repairHistoricRepository.insert([repairHistoric]);
  await carRepository.update(car);
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


//Customer endpoints
router.delete('/customer/:id', createAuth([1]), createRouteCallback(deleteCarCustomer));
router.patch('/customer',createAuth([1]),createBodySchemaParser(Car, 'updateSchemaDto'), createRouteCallback(updateCar));
router.get('/customer', createAuth([1]), createRouteCallback(getListForCustomer));
router.post('', createAuth([1]), createBodySchemaParser(Car), createRouteCallback(insertCar));
router.get('/customer/:id', createAuth([1]), createRouteCallback(getById));
router.patch('/deposit', createAuth([1]),createBodySchemaParser(Car, 'depositDto'), createRouteCallback(depositCar));



router.get('/to-receive', createRouteCallback(getListForAdmin));






router.patch('/add_current_repair',createBodySchemaParser(Car, 'repairUpdateDto'), createRouteCallback(addCurrentRepair));

router.patch('/repairs_progression', createRouteCallback(updateCarRepairsProgression));
router.get('/current_repair_to_valid', createRouteCallback(getCurrentRepairToValid));
router.patch('/valid_paiement', createRouteCallback(validPaiement));
router.patch('/exit_slip', createRouteCallback(generateExitSlip));
router.get('/atelier/current_repair', createRouteCallback(getCurrentRepairByCarAtelier));
router.get('/client/current_repair', createRouteCallback(getCurrentRepairByCarClient));
router.get('/atelier/repair', createRouteCallback(getRepairsAtelier));


module.exports = router;