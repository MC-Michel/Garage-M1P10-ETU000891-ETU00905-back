const {body} = require('express-validator'); 
class RepairDetailsElmt {
    static schema ={
            "label" : { type: 'string',  validatorGetter: (paramPropertyName='label')=> body(paramPropertyName).isString().notEmpty().withMessage("Label d'elements de reparations invalides")},
            "description": { type: 'string',  validatorGetter: (paramPropertyName='description')=> body(paramPropertyName).isString().withMessage("Description d'elements de reparations invalides")},
            "price": { type: 'string',  validatorGetter: (paramPropertyName='price')=> body(paramPropertyName).isFloat({ min:1}).withMessage("Prix d'elements de reparations invalide").toFloat()},
            "progression": { type: 'string',  validatorGetter: (paramPropertyName='progression')=> body(paramPropertyName).isInt({ min:0, max:100}).withMessage("Progression invalide").toInt()},
        }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static repairUpdateDto = {...this.schema}; 
    static repairAddCurrentDto = {...this.schema};
}

module.exports = RepairDetailsElmt;