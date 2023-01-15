const GenRepository = require("../commons/database/class/gen-repository");
const { addDays } = require("../commons/functions/gen-date");
const CustomError = require("../errors/custom-error")
const User = require("../models/user.model");
const TokenRepository = require("../repositories/token.repo");

const userRepository = new GenRepository(User)
const tokenRepository = new TokenRepository;
module.exports = class UserService {
    static async findUserByValidToken(token){
        return await tokenRepository.findUser(token);
    }
    static async findUserByEmailAndPassword(data){
        const users = await userRepository.find({
            excludeFields: ['password'],
            filter: [
                {
                    column: 'email',
                    type: 'string',
                    value: data.email,
                    comparator: '='
                },
                {
                    column: 'password',
                    type: 'string',
                    value: data.password,
                    comparator: '='
                },
            ]
        }) 
        if(users.data.length  === 0) throw new CustomError ("Email ou mot de passe invalide");
        return users.data[0];
    }
    static async logoutToken(token){

    }
    static async createToken(user){
        const creationDate = new Date()
        const token = {
            token: UserService.generateTokenStr(user),
            userId: user._id,
            createdAt: creationDate,
            expiresAt: addDays(creationDate, 1)
        }
        await tokenRepository.insert([token]);
        return token.token
    }

    static generateTokenStr(user){
        return new Date().toString()+user._id;
    }


}