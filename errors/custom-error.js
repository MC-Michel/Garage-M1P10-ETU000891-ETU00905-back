class CustomError extends Error{
    code;
    constructor(message, code=500){
        super(message);
        this.code = code;
    }
}
module.exports = CustomError;