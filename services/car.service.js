const { ObjectID } = require("bson");
const GenRepository = require("../commons/database/class/gen-repository");
const Car = require("../models/car.model");

 
const carRepository = new GenRepository(Car) 
module.exports = class CarService {
    static async findCoreCarById(_id){
        const filter = [{
            column: '_id',
            type: 'string',
            value: ObjectID(_id),
            comparator: '='
        }];
        const excludeFields = ['currentRepair'];
        const result = await carRepository.find({filter, excludeFields});
        if(result.data.length === 0) return null;
        return result.data[0];
    }

    static async findCoreCars(params){
        
        const excludeFields = ['currentRepair'];
        params.excludeFields = ['currentRepair'];
        if(!params.filter) params.filter = []
        params.filter.push({
            column: 'deletedAt',
            type:'date',
            comparator: 'notExistsOrNull'
        });
        const result = await carRepository.find(params);
        if(result.data.length === 0) return null;
        return result.data[0];
    }

    
}

     