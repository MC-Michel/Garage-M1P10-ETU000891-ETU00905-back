var express = require('express'); 
const GenRepository = require('../commons/database/class/gen-repository');
const { assign } = require('../commons/database/methods/gen-reflect');
const createRouteCallback = require('../commons/functions/create-route-callback');
const CustomError = require('../errors/custom-error');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const User = require('../models/user.model'); 
const TokenRepository = require('../repositories/token.repo');
const UserService = require('../services/user.service');
const createAuth = require('../middlewares/auth');
var router = express.Router();

const userRepository = new GenRepository(User);
const tokenRepository = new TokenRepository();

const signin = async function (req, res){
    const newUser = assign(User, req.body);
    if(req.body.confirmPassword !== newUser.password)
        throw new CustomError('Les 2 mots de passes sont differentes')
    newUser.roleId = 1;
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
    await tokenRepository.destroyToken(req.headers.token);
    res.json({message: "User deconnecte avec succes"});
}

const canAccess = async function (req, res) {
    const canAccess = req.roleId == req.currentUser.roleId;
    res.json({canAccess});
}

const createTest  = (n) => function (req, res){
    res.json({message:"Called test "+n})
}

router.post('/signin', createBodySchemaParser(User),createRouteCallback(signin));
router.post('/login', createBodySchemaParser(User, 'loginSchemaDto'), createRouteCallback(login));
router.get('/logout', createRouteCallback(logout));
router.post('/can-access', createBodySchemaParser(User, 'canAccessDto'), createRouteCallback(canAccess));

router.get('/test-1', createAuth(), createTest(1))
router.get('/test-2', createAuth([1]), createTest(2))
router.get('/test-3', createAuth([2]), createTest(3))

module.exports = router;