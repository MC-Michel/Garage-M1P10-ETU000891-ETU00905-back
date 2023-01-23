const {body} = require('express-validator'); 
const RepairDetails = require('./repair-details.model');
class RepairHistoric {
    static schema ={
        "carId": { type: 'int',  validatorGetter: (paramPropertyName='status')=> body(paramPropertyName).isInt().withMessage("Identifiant de la voiture invalide").toInt() },
        "status": { type: 'int',  validatorGetter: (paramPropertyName='status')=> body(paramPropertyName).isInt().withMessage("Statut invalide").toInt() },
        "receptionDate": { type: 'date', validatorGetter: (paramPropertyName='receptionDate')=> body(paramPropertyName).isISO8601().withMessage("Date de récéption invalide").toDate() },
        "repairs": { classConstructor: RepairDetails },
    }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static repairUpdateDto = {...this.schema}; 
    static collection = "RepairHistoric";
}

module.exports = RepairHistoric;