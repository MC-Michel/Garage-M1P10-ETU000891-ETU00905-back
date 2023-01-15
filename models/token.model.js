const { body } = require("express-validator");

class Token {
    static collection = "Token";
    static schema = {
        "userId": {
            type: 'string'
        },
        "token": {
            type: 'string', 
        },
        "createdAt":  {
            type: 'date',
        },
        "expiresAt": {
            type: 'date', 
        },
        "destroyedAt": {
            type: 'date'
        }
    }
    static createSchemaDto ={...this.schema}
    static updateSchemaDto = {...this.schema}
   
}
module.exports = Token;