const {body} = require('express-validator'); 
class Repair {
    static schema ={
        "carId": { type: 'int',  validatorGetter: (paramPropertyName='carId')=> body(paramPropertyName).isInt().withMessage("Identifiant de la voiture invalide").toInt() },
        "status": { type: 'int',  validatorGetter: (paramPropertyName='status')=> body(paramPropertyName).isInt().withMessage("Statut invalide").toInt() },
        "receptionDate": { type: 'date', validatorGetter: (paramPropertyName='receptionDate')=> body(paramPropertyName).isISO8601().withMessage("Date de récéption invalide").toDate() },
        "receptionTime": { type: 'time', validatorGetter: (paramPropertyName='receptionTime')=> body(paramPropertyName).isISO8601().withMessage("Heure de récéption invalide").toDate() },
        "repairs": { type: 'array',  validatorGetter: (paramPropertyName='repairs')=> body(paramPropertyName).isArray().withMessage("Les détails pour la réparation ne sont pas valide").toArray() },
    }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static collection = "Repair";
}

module.exports = Repair;