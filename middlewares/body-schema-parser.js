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
    if(schema == null) throw new Error(`Unknown schema for ${entityClass.name}: ${schemaName}`)
    for(let key of Object.keys(schema)){
        
        let currentKey = prefix === ''? key: `${prefix}.${key}`
        if(schema[key].classConstructor){
            if(schema[key].isArray) {
                ans.push(body(currentKey).isArray().withMessage(currentKey+' doit etre une liste'));
                currentKey = currentKey+".*"
            }
            ans.push(...createBodySchemaParser(schema[key].classConstructor, schemaName, currentKey));
            continue;
        }
        if(!schema[key].validatorGetter) continue;
        else{
            ans.push(schema[key].validatorGetter(currentKey));
        }
           
    }
    return ans;
}

module.exports = createBodySchemaParser;