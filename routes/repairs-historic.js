var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const RepairHistoric = require('../models/repair-historic.model');
var router = express.Router(); 
const createAuth = require('../middlewares/auth');
const { ObjectID } = require('bson');
const repairHistoricRepository = new GenRepository(RepairHistoric);  

const getListForCustomer = async function(req, res) {  
  const params = req.query;
  const carId = req.params.carId;
  if(!params.filter) params.filter = [];
  params.filter.push(
    {column: 'carId' , value: ObjectID(carId), comparator: '='},
  );
  console.log(params);
  const data = await repairHistoricRepository.find(params);
  res.json(data);
};
const getListForAdmin = async function(req, res) {  
  const data = await repairHistoricRepository.find(req.query);
  res.json(data);
};


router.get('/customer/:carId',createAuth([1]), createRouteCallback(getListForCustomer));
router.get('/admin',createAuth([2,3]), createRouteCallback(getListForAdmin));

module.exports = router;