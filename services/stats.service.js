const { query } = require("express-validator");
const GenRepository = require("../commons/database/class/gen-repository");
const { generateDaysOfMonth, generateDaysOfYear, formatAndTrunc } = require("../commons/functions/gen-date");
const CustomError = require("../errors/custom-error");
const CarRepository = require("../repositories/car.repo");
const ExpensesRepository = require("../repositories/expense.repo");
const RepairHistoryRepository = require("../repositories/repair-history.repo");


const carRepository = new CarRepository();
const expensesRepository = new ExpensesRepository();
const repairHistoryRepository = new RepairHistoryRepository();

module.exports = class StatsService{
    static caExpensesStatsValidators = [
        query('groupByValueLimit').isISO8601().toDate(),
        query('groupByType').isString(),
    ]
    static async findCaExpensesStats(groupByValueLimit, groupByType){
        let ansDates;
        if(groupByType === "month") ansDates = generateDaysOfMonth(groupByValueLimit);
        else if(groupByType === "year") ansDates = generateDaysOfYear(groupByValueLimit);
        else throw new CustomError("Parametre de groupe inconnu: "+groupByType);

        const caCurrent = await carRepository.findCurrentCaRepair(groupByValueLimit, groupByType);
        const repairCountCurrent = await carRepository.findCurrentCarNumberRepair(groupByValueLimit, groupByType);
        const caHistory = await repairHistoryRepository.findHistoryCaRepair(groupByValueLimit, groupByType);
        const repairCountHistory = await repairHistoryRepository.findHistoryRepairNumber(groupByValueLimit, groupByType);
        const expenses = await expensesRepository.findExpensesStats(groupByValueLimit, groupByType);

        const ans = [];
        ansDates.map(elmt => {
            let dateKey;
            if(groupByType === "month") dateKey = formatAndTrunc(elmt, "day");
            if(groupByType === "year") dateKey = formatAndTrunc(elmt, "month");
            const newRow = {};
            const currentCa = caCurrent[dateKey] ? caCurrent[dateKey].amount: 0;
            const historyCa = caHistory[dateKey] ? caHistory[dateKey].amount: 0;
            const currentRepairCount = repairCountCurrent[dateKey] ? repairCountCurrent[dateKey].count: 0;
            const historyRepairCount = repairCountHistory[dateKey] ? repairCountHistory[dateKey].count: 0;
            newRow.refDate = elmt;
            newRow.dateKey = dateKey;
            newRow.ca = currentCa + historyCa;
            newRow.repairCount = currentRepairCount + historyRepairCount;
            newRow.expenses = expenses[dateKey] ? expenses[dateKey].amount : 0;
            ans.push(newRow);
        })
        return ans;
    }
}