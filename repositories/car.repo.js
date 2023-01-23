const GenRepository = require("../commons/database/class/gen-repository");
const { getConnection } = require("../configs/db");
const Car = require("../models/car.model");

module.exports = class CarRepository extends GenRepository {
    constructor(){
        super(Car);
    }
    findCa(groupByValueLimit, groupByType){
        //unveil here
        const collection = this.getCollection();
        collection.aggregate([
            {

            }
        ])
    }
}