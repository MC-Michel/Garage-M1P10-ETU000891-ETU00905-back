const GenRepository = require("../commons/database/class/gen-repository");
const { formatAndTrunc } = require("../commons/functions/gen-date");
const { getConnection } = require("../configs/db");
const Car = require("../models/car.model");
const RepairHistoric = require("../models/repair-historic.model");
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
module.exports = class RepairHistoryRepository extends GenRepository {
    constructor(){
        super(RepairHistoric);
    }

    generateBaseAggrForGroup(groupByValueLimit,groupByType){
        return [
            {
                $addFields: {
                    timePeriod: { $dateToString: {format: vars[groupByType].timePeriodFormat, date: "$receptionDate"} },
                    timePeriodForFilter:  { $dateToString: {format: vars[groupByType].timePeriodFormatForFilter, date: "$receptionDate"} },
                    ended : "$repairs.ended"
                }
            },
            {
                $match: { timePeriodForFilter: {$eq: formatAndTrunc(groupByValueLimit, groupByType)}, currentRepair: {$and: [{$exists: true}, {$ne: null}]}}
            },
           
        ]
    } 
    async findHistoryCaRepair(groupByValueLimit, groupByType){
        const collection = this.getCollection();
        const results =   await collection.aggregate([
            ...this.generateBaseAggrForGroup(groupByValueLimit,groupByType),
            {
                $unwind: "$ended"
            },
            {
                $group: {
                    "_id": "$timePeriod",
                    "amount": {$sum: "$ended.price" }
                }
            }
        ]).toArray();
        const ans = {};
        results.map(elmt => ans[elmt._id] = elmt)
        return ans;
    }
    async findHistoryRepairNumber(groupByValueLimit, groupByType){
        const collection = this.getCollection();
        const results =    await collection.aggregate([
            ...this.generateBaseAggrForGroup(groupByValueLimit,groupByType),
            {
                $group: {
                    "_id": "$timePeriod",
                    "count": {$sum: 1 }
                }
            }
        ]).toArray();
        const ans = {};
        results.map(elmt => ans[elmt._id] = elmt)
        return ans;
    }
  

}