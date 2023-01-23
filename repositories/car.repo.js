const GenRepository = require("../commons/database/class/gen-repository");
const { formatAndTrunc } = require("../commons/functions/gen-date");
const { getConnection } = require("../configs/db");
const Car = require("../models/car.model");
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
module.exports = class CarRepository extends GenRepository {
    constructor(){
        super(Car);
    }

    generateBaseAggrForGroup(groupByValueLimit,groupByType){
        return [
            {
                $addFields: {
                    timePeriod: { $dateToString: {format: vars[groupByType].timePeriodFormat, date: "$currentRepair.receptionDate"} },
                    timePeriodForFilter:  { $dateToString: {format: vars[groupByType].timePeriodFormatForFilter, date: "$currentRepair.receptionDate"} },
                    ended : "$currentRepair.repairs.ended"
                }
            },
            {
                $project: { "currentRepair": 0 }
            },
            {
                $match: { timePeriodForFilter: {$eq: formatAndTrunc(groupByValueLimit, groupByType)}, currentRepair: {$and: [{$exists: true}, {$ne: null}]}}
            },
           
        ]
    } 
    findCurrentCaRepair(groupByValueLimit, groupByType){
        const collection = this.getCollection();
        collection.aggregate([
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
        ])
    }
    findCurrentCarNumberRepair(groupByValueLimit, groupByType){
        const collection = this.getCollection();
        collection.aggregate([
            ...this.generateBaseAggrForGroup(groupByValueLimit,groupByType),
            {
                $group: {
                    "_id": "$timePeriod",
                    "amount": {$sum: 1 }
                }
            }
        ])
    }
  

}