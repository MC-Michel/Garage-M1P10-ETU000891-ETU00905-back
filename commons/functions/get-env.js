const CustomError = require("../../errors/custom-error") 
require('dotenv').config()
module.exports = function(key){
    if( process.env[key] === null ||  process.env[key] === undefined)
        throw new CustomError("unknown env key: "+key)
    return process.env[key];
}