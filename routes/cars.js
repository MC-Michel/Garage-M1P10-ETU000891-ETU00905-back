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
const { findCoreCarById } = require('../services/car.service');
const { carStatus } = require('../models/constant.model');
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
  const body = assign(Car, req.body, 'createSchemaDto');
  body.status = Constant.carStatus.inCirculation;
  body.registrationDate = new Date();
  body.userId = req.currentUser._id;
  await carRepository.insert([body]);
  res.json({message: "Car created"});
}
const updateCar = async function(req, res) {
  const car = await CarService.findCoreCarById(req.body._id, {currentUser: req.currentUser, exists: true});
  const body = assign(Car, req.body, 'updateSchemaDto');
  await carRepository.update(body);
  res.json({message: "Car updated"});
}
const updateCarRepairsProgression = async function(req, res) {
  const car = await CarService.findCoreCarById(req.body._id, {exists: true});  
  const body = assign(Car, req.body, 'repairUpdateDto');
  await carRepository.update(body);
  res.json({message: "Car updated"});
}

const deleteCarCustomer = async function (req, res) {
  const car = await CarService.findCoreCarById(req.params.id, {currentUser: req.currentUser, exists: true});
  await carRepository.softDelete(req.params.id);
  res.json({message: "Voiture retirée"});
}
const depositCar = async function(req, res) { 
 
  const car = await CarService.findCoreCarById(req.body._id, {currentUser: req.currentUser, exists: true});
  const body = assign(Car,req.body, 'depositDto' );
  body.status = Constant.carStatus.deposited;
  await carRepository.update(body);
  res.json({message: "Voiture deposee en attente de validation"});
}

const getById = async function (req, res){
  const car = await CarService.findCoreCarById(req.params.id, {currentUser: req.currentUser, exists: true});
 
  res.json(car);
}
const addCurrentRepair = async function(req, res) {
  const car = findCoreCarById(req.body._id,  {exists: true})

  const body = assign(Car, req.body, 'repairUpdateDto');
  body.status = carStatus.inReparation;
  await carRepository.update(body);
  res.json({message: "Car updated"});
}
const getCurrentRepairToValid = async function(req, res) {  
  if(!req.query.filter)req.query.filter = [];
  req.query.filter.concat( [
    {column: 'currentRepair' , value:true, comparator: 'exists'},
    {column: 'currentRepair.status' , value:Constant.status.created, comparator: '='},
  ]);
  const data = await CarService.findCoreCars(req.query);
  res.json(data);
};
const validPaiement = async function(req, res) {
  const car =  await CarService.findCoreCarById(req.body._id, { exists: true});
  const body = assign(Car, req.body, 'paymentValidationDto')
  await carRepository.update(body);
  res.json({message: "Car updated"});
}
const generateExitSlip = async function(req, res) { 
  const car =  await carRepository.findById( req.body._id);
  if(car == null) throw new CustomError('La voiture n\'existe pas: '+req.body._id);
  console.log(car)
  let repairHistoric = car.currentRepair;
  repairHistoric.carId = ObjectId(car._id);
  const updatedStatusCar = assign(Car, req.body, 'exitGenerationDto');
  updatedStatusCar.currentRepair = null;
  await repairHistoricRepository.insert([repairHistoric]);
  await carRepository.update(updatedStatusCar);
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
  const car = await CarService.findCoreCarById( req.query.id, {currentUser: req.currentUser, exists: true});
  req.query.filter = [
    {column: '_id' , value:ObjectID(req.query.id), comparator: '='}
  ];
  const data = await carRepository.find(req.query);
  res.json(data);
};
const getRepairsAtelier = async function(req, res) {  
  if(!req.query.filter)req.query.filter = [];
  req.query.filter = req.query.filter.concat( [
    {column: 'currentRepair' , value:true, comparator: 'exists'},
    {column: 'status' , value:Constant.carStatus.inReparation, comparator: '='},
  ]);
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


//Admins endpoints
router.get('/admin', createAuth([2,3]), createRouteCallback(getListForAdmin));
router.patch('/add_current_repair', createAuth([2]),createBodySchemaParser(Car, 'repairAddCurrentDto'), createRouteCallback(addCurrentRepair));
router.patch('/repairs_progression',createAuth([2]),createBodySchemaParser(Car, 'repairUpdateDto'), createRouteCallback(updateCarRepairsProgression));
//router.get('/current_repair_to_valid',createAuth([2]), createRouteCallback(getCurrentRepairToValid));
router.patch('/valid_paiement',createAuth([3]), createRouteCallback(validPaiement));
router.patch('/exit_slip',createAuth([2]), createRouteCallback(generateExitSlip));

router.get('/admin/current_repair',createAuth([2, 3]), createRouteCallback(getCurrentRepairByCarAtelier));
router.get('/customer/current_repair',createAuth([1]), createRouteCallback(getCurrentRepairByCarClient));
router.get('/atelier/repair',createAuth([2]), createRouteCallback(getRepairsAtelier));


module.exports = router;