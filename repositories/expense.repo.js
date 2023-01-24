const GenRepository = require("../commons/database/class/gen-repository");
const { formatAndTrunc } = require("../commons/functions/gen-date");
const { getConnection } = require("../configs/db");
const Car = require("../models/car.model");
const Expenses = require("../models/expenses.model");
const vars = {
    "year": {
        timePeriodFormat: "%Y-%m",
        timePeriodFormatForFilter: "%Y",
    },
    "month": {
        timePeriodFormat: "%Y-%m-%d",
        timePeriodFormatForFilter: "%Y-%m",
    }
}
module.exports = class ExpensesRepository extends GenRepository {
    constructor(){
        super(Expenses);
    }

    generateBaseAggrForGroup(groupByValueLimit,groupByType){
        return [
            {
                $addFields: {
                    timePeriod: { $dateToString: {format: vars[groupByType].timePeriodFormat, date: "$expensesDate"} },
                    timePeriodForFilter:  { $dateToString: {format: vars[groupByType].timePeriodFormatForFilter, date: "$expensesDate"} },
                }
            },
            {
                $match: { timePeriodForFilter: {$eq: formatAndTrunc(groupByValueLimit, groupByType)}, $and:  [{currentRepair: {$exists: true}}, {currentRepair:{$ne: null}}]}
            },
           
        ]
    } 
    async findExpensesStats(groupByValueLimit, groupByType){
        const collection = this.getCollection();
        const results= await collection.aggregate([
            ...this.generateBaseAggrForGroup(groupByValueLimit,groupByType),
            {
                $unwind: "$details"
            },
            {
                $group: {
                    "_id": "$timePeriod",
                    "amount": {$sum: "$details.price" }
                }
            }
        ]).toArray();
        const ans = {};
        results.map(elmt=>ans[elmt._id]=elmt)
        return ans;
    }
  

}