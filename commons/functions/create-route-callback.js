const CustomError = require("../../errors/custom-error");

 
function createRouteCallback(f){
    return async function (req, res, next){
        try{
            const data = await f(req, res, next);
            res.json({
                status: 'success',
                data: data
            })
        }catch(e){
            let message= "An error occured...";
            console.log(e.message);
            if(e instanceof CustomError) message = e.message;
            res.json({
                status: 'error',
                message: message
            })
        }        
    };
}

module.exports = createRouteCallback