var express = require('express'); 
const { token } = require('morgan');
const GenRepository = require('../commons/database/class/gen-repository');
const { assign } = require('../commons/database/methods/gen-reflect');
const createRouteCallback = require('../commons/functions/create-route-callback');
const CustomError = require('../errors/custom-error');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const User = require('../models/user.model'); 
const UserService = require('../services/user.service');
var router = express.Router();

const userRepository = new GenRepository(User);


const signin = async function (req, res){
    const newUser = assign(User, req.body);
    if(req.body.confirmPassword !== newUser.password)
        throw new CustomError('Les 2 mots de passes sont differentes')
    newUser.role = 1;
    await userRepository.insert([newUser]);
    res.json({message: "Client enregistré"});
}

const login = async function (req, res){
    const user = await UserService.findUserByEmailAndPassword(req.body);
    if(!user) throw new CustomError('Email ou mot de passe invalide')
    const token = await UserService.createToken(user)
    res.json({user, token})
}

const logout = async function (req, res){
    throw new CustomError('Not implemented');
    //res.json({message: "User deconnecte avec succes"});
}

const canAccess = async function (req, res) {
    throw new CustomError('Not implemented');
    //res.json({canAccess: true});
}

router.post('/signin', createBodySchemaParser(User),createRouteCallback(signin));
router.post('/login', createBodySchemaParser(User, 'loginSchemaDto'), createRouteCallback(login));
router.get('/logout', createRouteCallback(logout));
router.post('/can-access', createBodySchemaParser(User, 'canAccessDto'), createRouteCallback(canAccess));

module.exports = router;