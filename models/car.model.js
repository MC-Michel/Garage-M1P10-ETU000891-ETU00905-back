const {body} = require('express-validator'); 
const Repair = require('./repair.model');

const _id = {
    tyep: 'string',
    validatorGetter: (paramPropertyName='_id')=> body(paramPropertyName).isString().withMessage('Identifiant invalide') 
}
class Car {
    static schema ={
        "brand": { type: 'string', validatorGetter: (paramPropertyName='brand')=> body(paramPropertyName).isString().withMessage("Marque invalide")  },
        "numberPlate": { type: 'string', validatorGetter: (paramPropertyName='numberPlate')=> body(paramPropertyName).isString().withMessage("Immatriculation invalide")  },
        "description": { type: 'string', validatorGetter: (paramPropertyName='description')=> body(paramPropertyName).isString().withMessage("Description invalide")  },
        //"weight": { type: 'int',  validatorGetter: (paramPropertyName='weight')=> body(paramPropertyName).isInt().withMessage("Poids invalide").toInt() },
        "status": { type: 'int',  validatorGetter: (paramPropertyName='status')=> body(paramPropertyName).isInt().withMessage("Statut invalide").toInt() },
        "registrationDate": { type: 'date', validatorGetter: (paramPropertyName='registrationDate')=> body(paramPropertyName).isISO8601().withMessage("Date d'enregistrement invalide").toDate() },
        "currentRepair": { classConstructor: Repair}
    }
    static createSchemaDto = (()=> { 
        const ans = {...this.schema}; 
        delete ans.currentRepair; 
        delete ans.status;
        delete ans.registrationDate;
        return ans;}) ();
    static updateSchemaDto = {...this.schema, _id};
    static depositDto = { _id }; 
    static collection = "Car";
}

module.exports = Car;