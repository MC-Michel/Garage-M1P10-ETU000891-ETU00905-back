const {body} = require('express-validator'); 

const _id = {
    tyep: 'string',
    validatorGetter: (paramPropertyName='_id')=> body(paramPropertyName).isString().withMessage('Identifiant invalide') 
}
class DefaultRepair {
    static schema ={
        "label" : { type: 'string',  validatorGetter: (paramPropertyName='label')=> body(paramPropertyName).isString().withMessage("Label d'elements de reparations invalides")},
        "description": { type: 'string',  validatorGetter: (paramPropertyName='description')=> body(paramPropertyName).isString().withMessage("Description d'elements de reparations invalides")},
        "price": { type: 'string',  validatorGetter: (paramPropertyName='price')=> body(paramPropertyName).isFloat().withMessage("Prix d'elements de reparations invalide")},
    }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static collection = "DefaultRepair";
}

module.exports = DefaultRepair;