"use strict";

const { MongoClient } = require("mongodb");

module.exports = class Db{
    static uri = "mongodb+srv://mc_user:F8Rdev_1nd_PurP8s3@cluster0.u4qva0r.mongodb.net/?retryWrites=true&w=majority";
    static dbName = "crud_quotes";

    static transactionOptions = {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary'
    };

    static connect(){
        return new MongoClient("mongodb+srv://mc_user:F8Rdev_1nd_PurP8s3@cluster0.u4qva0r.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
    }
}