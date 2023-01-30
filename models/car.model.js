const {body} = require('express-validator'); 
const RepairHistoric = require('./repair-historic.model');
const Repair = require('./repair.model');

const _id = {
    tyep: 'string',
    validatorGetter: (paramPropertyName='_id')=> body(paramPropertyName).isString().withMessage('Identifiant invalide') 
}
class Car {
    static schema ={
        "userId": {
            type: 'string'
        },
        "brand": { type: 'string', validatorGetter: (paramPropertyName='brand')=> body(paramPropertyName).isString().withMessage("Marque invalide")  },
        "numberPlate": { type: 'string', validatorGetter: (paramPropertyName='numberPlate')=> body(paramPropertyName).isString().withMessage("Immatriculation invalide").customSanitizer(elmt => elmt.replaceAll(' ', ''))  },
        "description": { type: 'string', validatorGetter: (paramPropertyName='description')=> body(paramPropertyName).isString().withMessage("Description invalide")  },
        "status": { type: 'int',  validatorGetter: (paramPropertyName='status')=> body(paramPropertyName).isInt().withMessage("Statut invalide").toInt() },
        "registrationDate": { type: 'date', validatorGetter: (paramPropertyName='registrationDate')=> body(paramPropertyName).isISO8601().withMessage("Date d'enregistrement invalide").toDate() },
        "currentRepair": { classConstructor: Repair},
    }
    static createSchemaDto = (()=> { 
        const ans = {...this.schema}; 
        delete ans.currentRepair; 
        delete ans.status;
        delete ans.registrationDate;
        return ans;}) ();
    static updateSchemaDto =  (()=> { 
        const ans = {...this.schema, _id}; 
        delete ans.currentRepair; 
        delete ans.status;
        delete ans.registrationDate;
        return ans;}) ();
    static depositDto = { _id }; 
    static exitDto = { _id }; 
    static repairAddCurrentDto = { "currentRepair": { classConstructor: Repair}};
    static repairUpdateDto = { "currentRepair": { classConstructor: Repair}, _id } 
    static paymentValidationDto =  {  "currentRepair": { classConstructor: Repair}, _id } 
    static exitGenerationDto = {"status": this.schema.status, _id, "exitInitDate": RepairHistoric.schema.exitInitDate}
    static collection = "Car";
}

module.exports = Car;