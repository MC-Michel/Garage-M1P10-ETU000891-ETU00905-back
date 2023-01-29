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
                    timePeriod: { $dateToString: {format: vars[groupByType].timePeriodFormat, date: {$toDate: "$receptionDate"} } },
                    timePeriodForFilter:  { $dateToString: {format: vars[groupByType].timePeriodFormatForFilter, date:  {$toDate: "$receptionDate"}} },
                    ended : "$repairs.ended"
                }
            },
            {
                $match: { timePeriodForFilter: {$eq: formatAndTrunc(groupByValueLimit, groupByType)}}
            },
           
        ]
    } 
    async findHistoryCaRepair(groupByValueLimit, groupByType){
        const collection = this.getCollection();
        const aggregateArr = [
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
        ]
        console.log(JSON.stringify(aggregateArr));
        const results =   await collection.aggregate(aggregateArr).toArray();
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

    async findAvgReparationDaysCount(){
        const collection = this.getCollection();
        const result = await collection.aggregate([
            {
                $addFields: {
                    "reparationDuration": {$subtract: [ '$exitInitDate','$receptionDate']}
                }
            },
            {
                $group: {
                    _id: null,
                    avgReparationDuration: {$avg: "$reparationDuration"}
                }
            }
        ]).toArray();
       
        const avgReparationDateCount = result[0].avgReparationDuration/(1000*60*60*24);
       
        return Math.floor(avgReparationDateCount*100)/100;
    }

}