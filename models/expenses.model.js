const {body} = require('express-validator'); 
class Expenses {
    static schema ={
        "expensesDate": { type: 'date', validatorGetter: (paramPropertyName='expensesDate')=> body(paramPropertyName).isISO8601().withMessage("Date invalide").toDate() },
        "expensesTime": { type: 'time', validatorGetter: (paramPropertyName='expensesTime')=> body(paramPropertyName).isISO8601().withMessage("Heure invalide").toDate() },
        "details": { type: 'array',  validatorGetter: (paramPropertyName='details')=> body(paramPropertyName).isArray().withMessage("Les détails pour les dépenses ne sont pas valide").toArray() },
    }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static collection = "Expenses";
}

module.exports = Expenses;