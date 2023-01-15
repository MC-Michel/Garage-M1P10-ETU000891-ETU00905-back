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

function createBodySchemaParser(schema, prefix=''){
    let ans = []
    for(let key of Object.keys(schema)){
        const currentKey = prefix === ''? key: `${prefix}[${key}]`
        if(schema.classConstructor)
            ans = ans.append(createBodySchemaParser(schema.classConstructor.schema, currentKey));
        else
            ans.push(schema[key].validatorGetter(currentKey));
    }
    return ans;
}

module.exports = createBodySchemaParser;