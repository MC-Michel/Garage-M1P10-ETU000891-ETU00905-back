var express = require('express');
const { getConnection } = require('../configs/db');
var router = express.Router();

router.get('', async function(req, res) {
  await getConnection();
    res.json({
      "data" : "List of cars"
    });
  });

module.exports = router;