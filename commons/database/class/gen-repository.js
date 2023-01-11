const { getConnection } = require("../../../configs/db"); 

class GenRepository {
    entityClass;
    constructor(entityClass){
        this.entityClass = entityClass;
    } 
    insert(entities){

    }
    /**
     * 
     * @param {{columnNames?: string, options?: any}} options 
     * @returns 
     */
    async findAll(options){
        const colNames = options.columnNames ? options.columnNames : Object.getOwnPropertyNames(new this.entityClass)
        const collection = await getConnection().collection(this.entityClass.collection);
        return {
            data: await collection.find(options.options?options.options:{}).toArray()
        };
    }
    findOne(options){

    }
}

module.exports = GenRepository;