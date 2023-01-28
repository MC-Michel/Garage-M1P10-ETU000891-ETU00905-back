var express = require('express'); 
const createRouteCallback = require('../commons/functions/create-route-callback');
const StatsService = require('../services/stats.service');
var router = express.Router();
const createAuth = require('../middlewares/auth');


const getStats = async function(req, res) {  
  const results = await StatsService.findCaExpensesStats(req.query.groupByValueLimit, req.query.groupByType);
  res.json(results);
};
router.get('',createAuth([2,3]), StatsService.caExpensesStatsValidators ,createRouteCallback(getStats));
 
module.exports = router;