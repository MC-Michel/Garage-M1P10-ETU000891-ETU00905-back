const {body} = require('express-validator'); 
const _id = {
    type: 'string',
    validatorGetter: (paramPropertyName='_id') => body(paramPropertyName).isString()
}
class Expenses {
    static schema ={
        "expensesDate": { type: 'date', validatorGetter: (paramPropertyName='expensesDate')=> body(paramPropertyName).isISO8601().withMessage("Date invalide").toDate() },
        "details": { type: 'array',  validatorGetter: (paramPropertyName='details')=> body(paramPropertyName).isArray().withMessage("Les détails pour les dépenses ne sont pas valide").toArray() },
    }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema, _id};
    static collection = "Expenses";
}

module.exports = Expenses;