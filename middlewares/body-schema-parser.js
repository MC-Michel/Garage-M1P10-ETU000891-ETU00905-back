const {body} = require('express-validator');
const Car = require('../models/car.model');
/**
 * 
 * @param {{
 * [propertyName]: {
*      type: string,
*      validator: Validator chain
*  }
 * }
 *  
 * } schema 
 * @returns 
 */

function createBodySchemaParser(entityClass,schemaName='createSchemaDto', prefix=''){
    let ans = []
    const schema = entityClass[schemaName];
    for(let key of Object.keys(schema)){
        
        const currentKey = prefix === ''? key: `${prefix}.${key}`
        if(schema[key].classConstructor){
            ans.push(...createBodySchemaParser(schema[key].classConstructor, schemaName, currentKey));
        }
        if(!schema[key].validatorGetter) continue;
        else{
            ans.push(schema[key].validatorGetter(currentKey));
        }
           
    }
    return ans;
}

module.exports = createBodySchemaParser;