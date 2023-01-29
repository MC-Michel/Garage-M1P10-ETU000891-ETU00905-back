var express = require('express'); 
const createRouteCallback = require('../commons/functions/create-route-callback');
const StatsService = require('../services/stats.service');
var router = express.Router();
const createAuth = require('../middlewares/auth');
const RepairHistoryRepository = require('../repositories/repair-history.repo');

const repairHistoricRepository = new RepairHistoryRepository();

const getStats = async function(req, res) {  
  const moneyStats = await StatsService.findCaExpensesStats(req.query.groupByValueLimit, req.query.groupByType);
  const avgReparationDaysDuration = await repairHistoricRepository.findAvgReparationDaysCount()
   
  res.json({moneyStats,avgReparationDaysDuration });
};
router.get('',createAuth([2,3]), StatsService.caExpensesStatsValidators ,createRouteCallback(getStats));
 
module.exports = router;