var express = require('express');
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const Car = require('../models/car.model');
var router = express.Router();

const carRepository = new GenRepository(Car);

const getList = async function(req, res) { 
  const data = await carRepository.findAll({});
  res.json(data);
};

router.get('', createRouteCallback(getList));

module.exports = router;