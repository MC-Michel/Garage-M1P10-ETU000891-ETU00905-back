const {body} = require('express-validator'); 
const RepairDetails = require('./repair-details.model');
const _id = {
    tyep: 'string',
    validatorGetter: (paramPropertyName='_id')=> body(paramPropertyName).isString().withMessage('Identifiant invalide') 
}
class Repair {
    static schema ={
        "status": { type: 'int',  validatorGetter: (paramPropertyName='status')=> body(paramPropertyName).isInt().withMessage("Statut invalide").toInt() },
        "receptionDate": { type: 'date', validatorGetter: (paramPropertyName='receptionDate')=> body(paramPropertyName).isISO8601().withMessage("Date de récéption invalide").toDate() },
        "repairs": { classConstructor: RepairDetails },
    }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static repairUpdateDto = {...this.schema, _id}; 
    static repairAddCurrentDto = {...this.schema};
    static paymentValidationDto= { "status": this.schema.status};
    static collection = "Repair";
}

module.exports = Repair;