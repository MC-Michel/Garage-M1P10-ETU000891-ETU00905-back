const CustomError = require("../../errors/custom-error");

 
function createRouteCallback(f){
    return async function (req, res, next){
        try{
          await f(req, res);
        }catch(e){
            let message= "An error occured...";
            console.log(e.message);
            if(e instanceof CustomError) message = e.message;
            res.status(e.code).json({message: message})
        }        
    };
}

module.exports = createRouteCallback