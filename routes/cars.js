var express = require('express');
const GenRepository = require('../commons/database/class/gen-repository');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
const Car = require('../models/car.model');
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

router.get('', createRouteCallback(getList));
router.post('', createRouteCallback(insertCar));
router.delete('/:id', createRouteCallback(deleteCar));
router.patch('', createRouteCallback(updateCar))

module.exports = router;