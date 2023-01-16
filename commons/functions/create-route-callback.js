const { validationResult } = require("express-validator");
const CustomError = require("../../errors/custom-error");

 
function createRouteCallback(f){
    return async function (req, res, next){
        try{
            const errors = validationResult(req);
            if(errors){
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: errors.array().map(elmt => elmt.msg).join('\n') });
                }
            }
           
          await f(req, res);
        }catch(e){
            let message= "Une erreur s'est produite...";
            console.log(e.message);
            if(e instanceof CustomError) message = e.message;
            res.status(e.statusCode?e.statusCode:500 ).json({message: message})
        }        
    };
}

module.exports = createRouteCallback