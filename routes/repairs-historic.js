var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const RepairHistoric = require('../models/repair-historic.model');
var router = express.Router();

const repairHistoricRepository = new GenRepository(RepairHistoric);  

const getListForCustomer = async function(req, res) {  
  const params = req.query;
  if(!params.filter) params.filter = [];
  const data = await repairHistoricRepository.find(params);
  res.json(data);
};
const getListForAdmin = async function(req, res) {  
  const data = await repairHistoricRepository.find(req.query);
  res.json(data);
};


router.get('/customer', createRouteCallback(getListForCustomer));
router.get('/admin', createRouteCallback(getListForAdmin));

module.exports = router;