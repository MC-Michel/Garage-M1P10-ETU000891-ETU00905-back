"use strict";

const { MongoClient } = require("mongodb");
const env= require('../commons/functions/get-env')

var client;
function getConnection(){
    const dbName =  env('MONGO_DBNAME');
    if(!client){
        const url = env('MONGO_URL');
       
        const options =  { useNewUrlParser: true, useUnifiedTopology: true };
        client = new MongoClient(url, options);
    }   

    client = client.db(dbName)
    
    return client;
}
const transactionOptions = {
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
    readPreference: 'primary'
};

module.exports.transactionOptions = transactionOptions;
module.exports.getConnection = getConnection;