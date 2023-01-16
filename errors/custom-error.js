class CustomError extends Error{
    statusCode;
    constructor(message, statusCode=500){
        super(message);
        this.statusCode = statusCode;
    }
}
module.exports = CustomError;