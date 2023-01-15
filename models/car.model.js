const {body} = require('express-validator'); 
class Car {
    static schema ={
        "brand": { type: 'string', validator: body('brand').isString().withMessage("Marque invalide")  },
        "numberPlate": { type: 'string', validator: body('numberPlate').isString().withMessage("Immatriculation invalide")  },
        "weight": { type: 'int',  validator: body('weight').isInt().withMessage("Poids invalide").toInt() },
        "registrationDate": { type: 'date', validator: body('registrationDate').isISO8601().withMessage("Date d'enregistrement invalide").toDate() }
    }
    static collection = "Car";
}

module.exports = Car;