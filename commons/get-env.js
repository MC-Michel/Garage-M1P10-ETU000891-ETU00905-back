const envFile = process.env.NODE_ENV === 'production' ? 'environment.prod' : 'environment';

const CustomError = require("../errors/custom-error")
const environment= require('../environments/'+envFile)

module.exports = function (key){
    if( environment[key] === null ||  environment[key] === undefined)
        throw new CustomError("unknown env key: "+key)
    return  environment[key];
}