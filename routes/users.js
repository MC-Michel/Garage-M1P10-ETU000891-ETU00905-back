var express = require('express'); 
const { token } = require('morgan');
const GenRepository = require('../commons/database/class/gen-repository');
const { assign } = require('../commons/database/methods/gen-reflect');
const createRouteCallback = require('../commons/functions/create-route-callback');
const createBodySchemaParser = require('../middlewares/body-schema-parser');
const User = require('../models/user.model');
var router = express.Router();

const userRepository = new GenRepository(User);


const signin = async function (req, res){
    const newUser = assign(User, req.body);
    newUser.role = 1;
    userRepository.insert([newUser]);
    res.json({message: "Client enregistré"});
}
 
router.post('/signin', createBodySchemaParser(User),createRouteCallback(signin));
 
module.exports = router;