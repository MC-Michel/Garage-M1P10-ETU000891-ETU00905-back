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
     * @param {{
     *  excludeFields?: string[], 
     *  options?: {
     *          pagination?: {
     *              page: string, 
    *               pageElmtCount: string,
    *               orderBy: {column: string, order: 'asc'|'desc'}[]
     *          }
     *      }
     * }} options 
     * @returns any[]
     * 
     * pagination[page] is a string because of queryParams
     */
    async find(options){
        let colNames = Object.getOwnPropertyNames(new this.entityClass);
        let queryOptions = {};
        
        let createPaginationOptions = this.createPaginationOptions(options.pagination);
        queryOptions = {...queryOptions, ...createPaginationOptions};

        if(options.excludeFields){
            colNames = colNames.filter(elmt => !options.excludeFields.includes(elmt));
        }
        const collection =  getConnection().collection(this.entityClass.collection);
        return {
            data: (await collection.find({},queryOptions).toArray())
                .map(elmt => Object.assign(new this.entityClass, elmt))
        };
    } 


    createPaginationOptions(pagination){ 
        if(pagination == null) return {};
        if( pagination.orderBy == null) pagination.orderBy = [{column: '_id', order: 'asc'}];
        const ans = {
            limit: +pagination.pageElmtCount,
            skip: pagination.pageElmtCount * (pagination.page-1),
            sort: pagination.orderBy.map(elmt => [elmt.column, elmt.order])
        } ;
        console.log(ans);
        return ans;
    }
    
    async update(entity) {
        const collection = getConnection().collection(this.entityClass.collection);
        const id = entity._id;
        delete entity._id;
        return await collection.updateOne({_id: id}, {$set: entity});
    }

    async delete(id){
        const collection = getConnection().collection(this.entityClass.collection);
        return await collection.deleteOne({_id: id});
    }
}

module.exports = GenRepository;