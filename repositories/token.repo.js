const GenRepository = require("../commons/database/class/gen-repository");
const CustomError = require("../errors/custom-error");
const Token = require("../models/token.model");

module.exports = class TokenRepository extends GenRepository{
    constructor(){
        super(Token)
    }
    async findUser(token){
        const currentCollection = this.getCollection();
        const results = await currentCollection.aggregate([
            {
                $match: { token, $or: [{ expiresAt: {$gt: new Date()}}, { destroyedAt: {$exists: true, $ne: null}}]},
                $lookup:{
                    from: 'User',
                    localField: "userId",
                    foreignField: "_id",
                    as: 'user'
                }
            }
        ]).toArray();
        if(results.length === 0) throw new CustomError("Token invalide");
        return results[0].user;
    }
    async destroyToken(token){
        const currentCollection = this.getCollection();
        await currentCollection.updateOne({token}, {$set: {destroyedAt: new Date()}})
    }
}