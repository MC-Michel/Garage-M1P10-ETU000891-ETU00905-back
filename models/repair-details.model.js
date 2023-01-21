const {body} = require('express-validator'); 
class RepairDetails {
    static schema ={
        "ended": { type: 'array',  validatorGetter: (paramPropertyName='ended')=> body(paramPropertyName).isArray().withMessage("Elements de reparations termines invalides").toArray() },
        "inprogress": { type: 'array',  validatorGetter: (paramPropertyName='inProgress')=> body(paramPropertyName).isArray().withMessage("Elements de reparations en cours invalides").toArray() },
        "todo": { type: 'array', validatorGetter: (paramPropertyName='todo')=> body(paramPropertyName).isArray().withMessage("Elements de reparations a faire invalide").toDate() },
        }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static repairUpdateDto = {...this.schema}; 
}

module.exports = RepairDetails;