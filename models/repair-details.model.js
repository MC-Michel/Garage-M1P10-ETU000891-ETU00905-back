const {body} = require('express-validator'); 
const RepairDetailsElmt = require('./repair-details-elmt.model');
class RepairDetails {
    static schema ={
        "ended": { classConstructor: RepairDetailsElmt, isArray: true },
        "inprogress": { classConstructor: RepairDetailsElmt, isArray: true},
        "todo": {classConstructor: RepairDetailsElmt, isArray: true },
        }
    static createSchemaDto = {...this.schema};
    static updateSchemaDto = {...this.schema};
    static repairUpdateDto = {...this.schema}; 
}

module.exports = RepairDetails;