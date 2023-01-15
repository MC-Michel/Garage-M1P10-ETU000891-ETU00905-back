var express = require('express'); 
const { token } = require('morgan');
const GenRepository = require('../commons/database/class/gen-repository');
const { assign } = require('../commons/database/methods/gen-reflect');
const createRouteCallback = require('../commons/functions/create-route-callback');
const CustomError = require('../errors/custom-error');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const User = require('../models/user.model');
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
 
router.post('/signin', createBodySchemaParser(User),createRouteCallback(signin));
 
module.exports = router;