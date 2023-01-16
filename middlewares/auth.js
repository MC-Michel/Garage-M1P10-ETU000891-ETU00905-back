const noAuthenticationMessage = "Aucun utilisteur connecte";
const { check } = require('express-validator');
const CustomError = require('../errors/custom-error');
const UserService = require('../services/user.service');


module.exports = function createAuth(allowedRoles=[]){
    const tokenCheck = check.headers('token').isString().withMessage(noAuthenticationMessage);
    const authentication = async function (req, res, next){
        try{
            const token = req.headers.token;
            const user = await UserService.findUserByValidToken(token);
            if(!user)throw new CustomError ("Session expire");
            req.currentUser = user;
            next();
        }catch(e){
            let message= "Une erreur s'est produite...";
            console.log(e.message);
            if(e instanceof CustomError) message = e.message;
            res.status(e.code?e.code:500 ).json({message: message});
        }
      
    }
    const authorization = async function (req, res, next){
        const allowedRolesArr = [...allowedRoles];
        if(allowedRolesArr.length ===0) next(); //all roles allowed
        if(allowedRolesArr.includes(req.currentUser.roleId)) next();
        else res.status(403).json("Acces interdit");
    }
    return [tokenCheck, authentication, authorization];
}