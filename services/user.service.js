const GenRepository = require("../commons/database/class/gen-repository")
const CustomError = require("../errors/custom-error")
const User = require("../models/user.model")

const userRepository = new GenRepository(User)
module.exports = class UserService {
    static async findUserByToken(token){

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
    static async createToken(){

    }
}