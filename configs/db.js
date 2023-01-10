"use strict";

const { MongoClient } = require("mongodb");

var client;
function getConnection(){
    if(!client){
        const url = "mongodb+srv://mc_user:F8Rdev_1nd_PurP8s3@cluster0.u4qva0r.mongodb.net/?retryWrites=true&w=majority";
        const options =  { useNewUrlParser: true, useUnifiedTopology: true };
        client = new MongoClient(url, options);
    }
    return client;
}
const transactionOptions = {
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
    readPreference: 'primary'
};

module.exports.transactionOptions = transactionOptions;
module.exports.getConnection = getConnection;