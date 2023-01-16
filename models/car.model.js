const {body} = require('express-validator'); 
class Car {
    static schema ={
        "brand": { type: 'string', validatorGetter: (paramPropertyName='brand')=> body(paramPropertyName).isString().withMessage("Marque invalide")  },
        "numberPlate": { type: 'string', validatorGetter: (paramPropertyName='numberPlate')=> body(paramPropertyName).isString().withMessage("Immatriculation invalide")  },
        "description": { type: 'string', validatorGetter: (paramPropertyName='description')=> body(paramPropertyName).isString().withMessage("Description invalide")  },
        "weight": { type: 'int',  validatorGetter: (paramPropertyName='weight')=> body(paramPropertyName).isInt().withMessage("Poids invalide").toInt() },
        "status": { type: 'int',  validatorGetter: (paramPropertyName='status')=> body(paramPropertyName).isInt().withMessage("Statut invalide").toInt() },
        "registrationDate": { type: 'date', validatorGetter: (paramPropertyName='registrationDate')=> body(paramPropertyName).isISO8601().withMessage("Date d'enregistrement invalide").toDate() }
    }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static collection = "Car";
}

module.exports = Car;