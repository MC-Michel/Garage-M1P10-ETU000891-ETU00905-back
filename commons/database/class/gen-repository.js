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
     *  pagination?: {
     *              page: string, 
    *               pageElmtCount: string,
    *               orderBy: {column: string, order: 'asc'|'desc'}[]
     *          }
     * }} options 
     * @returns any[]
     * 
     * pagination[page] is a string because of queryParams
     */
    async find(params){
        let colNames = Object.keys(this.entityClass.schema);
        let queryOptions = {};
        
        let createPaginationOptions = this.createPaginationOptions(params.pagination);
        queryOptions = {...queryOptions, ...createPaginationOptions};
        console.log(params)
        if(params.excludeFields){
            colNames = colNames.filter(elmt => !params.excludeFields.includes(elmt));
        }
        const collection =  getConnection().collection(this.entityClass.collection);
        const results = await collection.find({},queryOptions).toArray();
         
        return {
            data: results
                .map(elmt => Object.assign(new this.entityClass, elmt)),
            meta: {
                totalElmtCount: (await collection.countDocuments())
            }
        };
    } 


    createPaginationOptions(pagination){ 
        if(pagination == null) return {};
        if( pagination.orderBy == null) pagination.orderBy = [];
        pagination.orderBy.push({column: '_id', order: 'asc'});
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