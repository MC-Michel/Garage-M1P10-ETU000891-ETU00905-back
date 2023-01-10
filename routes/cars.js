var express = require('express');
const createRouteCallback = require('../commons/functions/create-route-callback');
const { getConnection } = require('../configs/db');
var router = express.Router();

const getList = async function(req, res) {
  await getConnection();
    res.json({
      "data" : "List of cars"
    });
  };

router.get('', createRouteCallback(getList));

module.exports = router;