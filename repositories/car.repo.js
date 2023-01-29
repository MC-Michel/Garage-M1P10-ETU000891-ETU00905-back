 
 
 
const { ObjectID } = require("bson");
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
    async findCurrentRepair(repairId){
        const filter = [{
            column:'currentRepair._id',
            value: ObjectID(repairId),
            comparator: '='
        }];
        const result = await this.find({filter});
        if(result.data.length == 0) return null;
        result.data[0].currentRepair.carId = result.data[0]._id;
        return result.data[0].currentRepair;

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
                $match: { timePeriodForFilter: {$eq: formatAndTrunc(groupByValueLimit, groupByType)}, $and: [{currentRepair: {$exists: true}}, {currentRepair:{$ne: null}}]}
            },
           
        ]
    } 
    async findCurrentCaRepair(groupByValueLimit, groupByType){
        const collection = this.getCollection();
        const results = await collection.aggregate([
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
        results.map(elmt => ans[elmt._id] = elmt);
        return ans;
    }
    async findCurrentCarNumberRepair(groupByValueLimit, groupByType){
        const collection = this.getCollection();
        const results = await collection.aggregate([
            ...this.generateBaseAggrForGroup(groupByValueLimit,groupByType),
            {
                $group: {
                    "_id": "$timePeriod",
                    "count": {$sum: 1 }
                }
            }
        ]).toArray();
        const ans = {};
        results.map(elmt => ans[elmt._id] = elmt);
        return ans;
    }
  

}