const { body } = require("express-validator");

class Customer {
    static schema = {
        "licenceType": {
            type: 'string', 
            validatorGetter: (paramPropertyName='licenceType')=> 
                body(paramPropertyName).isString().withMessage("Type de permis invalide")
        },
    };
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
}
module.exports = Customer;