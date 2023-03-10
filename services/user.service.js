const GenRepository = require("../commons/database/class/gen-repository");
const { addDays } = require("../commons/functions/gen-date");
const CustomError = require("../errors/custom-error")
const md5 = require("md5");
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
                    value: md5(data.password),
                    comparator: '='
                },
            ]
        }) 
        if(users.data.length  === 0) return null;
        return users.data[0];
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

    //TODO: Generate a real token
    static generateTokenStr(user){
        return md5(new Date().toString()+user._id);
    }

    static buildSigninMail(newUser){
        let societyName = "K-OJAO";
        let mail = {
            to: newUser.email,
            subject: `Bienvenue chez ${societyName}`,
            html: `
                <p>Cher ${newUser.firstName},</p>

                <p>Nous sommes ravis de vous accueillir sur notre site web ${societyName}. Nous sommes un garage qui propose des services de r??paration et d'entretien pour les v??hicules de toutes marques.</p>
                
                <p>Nous esp??rons que vous trouverez toutes les informations n??cessaires pour prendre soin de votre v??hicule sur notre site. N'h??sitez pas ?? nous contacter si vous avez des questions ou si vous souhaitez prendre rendez-vous pour une r??vision.</p>
                
                <p>En vous inscrivant sur notre site, vous avez acc??s ?? des offres exclusives et des r??ductions sur nos services. N'oubliez pas de v??rifier r??guli??rement votre compte pour ne pas manquer ces opportunit??s.</p>
                
                <p>Encore une fois, bienvenue chez ${societyName} et nous esp??rons vous voir bient??t.</p>
                
                <p>Cordialement,</p>
                <p>${societyName}</p>
            `
        };
        return mail;
    }


}