const {body} = require('express-validator'); 
class Car {
    static schema ={
        "brand": { type: 'string', validator: body('brand').isString()  },
        "numberPlate": { type: 'string', validator: body('numberPlate').isString()  },
        "weight": { type: 'int',  validator: body('weight').isInt().toInt() },
        "registrationDate": { type: 'date', validator: body('registrationDate').isISO8601().toDate() }
    }
    static collection = "Car";
}

module.exports = Car;