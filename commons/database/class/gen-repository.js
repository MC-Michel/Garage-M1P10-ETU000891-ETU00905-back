const { getConnection } = require("../../../configs/db"); 

class GenRepository {
    entityClass;
    constructor(entityClass){
        this.entityClass = entityClass;
    } 
    /**
     * 
     * @param {any[]} entities 
     * @returns any
     */
    async insert(entities){
        const collection = getConnection().collection(this.entityClass.collection);
        return await collection.insertMany(entities);
    }
    /**
     * 
     * @param {{columnNames?: string, options?: any}} options 
     * @returns any[]
     */
    async find(options){
        const colNames = options.columnNames ? options.columnNames : Object.getOwnPropertyNames(new this.entityClass)
        const collection =  getConnection().collection(this.entityClass.collection);
        return {
            data: (await collection.find(options.options?options.options:{}).toArray())
                .map(elmt => Object.assign(new this.entityClass, elmt))
        };
    }
    findOne(options){

    }
}

module.exports = GenRepository;