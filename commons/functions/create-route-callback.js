const { validationResult } = require("express-validator");
const CustomError = require("../../errors/custom-error");

 
function createRouteCallback(f){
    return async function (req, res, next){
        try{
            const errors = validationResult(req);
            if(errors){
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
            }
           
          await f(req, res);
        }catch(e){
            let message= "An error occured...";
            console.log(e.message);
            if(e instanceof CustomError) message = e.message;
            res.status(e.code?e.code:500 ).json({message: message})
        }        
    };
}

module.exports = createRouteCallback