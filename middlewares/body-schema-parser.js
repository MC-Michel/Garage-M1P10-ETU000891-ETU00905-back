const {body} = require('express-validator')
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
function createBodySchemaParser(schema){
    const ans = []
    for(let key of Object.keys(schema)){
       ans.push(schema[key].validator);
    }
    return ans;
}

module.exports = createBodySchemaParser;