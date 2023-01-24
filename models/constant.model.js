const { body } = require("express-validator");

class Constant {
    static status = {
        deleted : -1,
        created : 0,
        validated : 1
    };
    static carStatus = {
        inCirculation : 0, 
        deposited : 1,
        inReparation: 2
    };
    static repairStatus = {
        todo : 0,
        inprogress : 1,
        ended : 2
    };
    static tva = 20;
}
module.exports = Constant;