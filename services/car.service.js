const { ObjectID } = require("bson");
const GenRepository = require("../commons/database/class/gen-repository");
const CustomError = require("../errors/custom-error");
const Car = require("../models/car.model");

 
const carRepository = new GenRepository(Car) 
module.exports = class CarService {
    static async findCoreCarById(_id, options = {}){
        const filter = [{
            column: '_id',
            type: 'string',
            value: ObjectID(_id),
            comparator: '='
        }];
        const excludeFields = ['currentRepair'];
        const result = await carRepository.find({filter, excludeFields});
        if(result.data.length === 0) 
            if(options.exists) throw new CustomError('Aucune voiture correspondante')    
            else return null;
        if(options.currentUser && !options.currentUser._id.equals(result.data[0].userId )) 
            throw new CustomError(`La voiture ${result.data[0].numberPlate} n'appartient pas a l'utilisateur actuel`);
        if(!options.alsoDeleted && result.data[0].deletedAt)
            throw new CustomError('La voiture a déjà ete supprimée');
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
        return result;
    }

    
    
}

     