const {body} = require('express-validator'); 
class RepairDetailsElmt {
    static schema ={
            "label" : { type: 'string',  validatorGetter: (paramPropertyName='label')=> body(paramPropertyName).isString().withMessage("Label d'elements de reparations invalides")},
            "description": { type: 'string',  validatorGetter: (paramPropertyName='description')=> body(paramPropertyName).isString().withMessage("Description d'elements de reparations invalides")},
            "price": { type: 'string',  validatorGetter: (paramPropertyName='price')=> body(paramPropertyName).isFloat().withMessage("Prix d'elements de reparations invalide").toFloat()},
        }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static repairUpdateDto = {...this.schema}; 
}

module.exports = RepairDetailsElmt;