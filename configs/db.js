"use strict";

const { MongoClient } = require("mongodb");
const env= require('../commons/get-env')

var client;
async function getConnection(){
    if(!client){
        const url = env('MONGO_URL');
        const dbName =  env('MONGO_DBNAME');
        const options =  { useNewUrlParser: true, useUnifiedTopology: true };
        client = new MongoClient(url, options);
        client.dbName = dbName;
        
    }
    client = await client.connect()
    return client;
}
const transactionOptions = {
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
    readPreference: 'primary'
};

module.exports.transactionOptions = transactionOptions;
module.exports.getConnection = getConnection;