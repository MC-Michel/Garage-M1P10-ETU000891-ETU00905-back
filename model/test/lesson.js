"use strict";

const Db = require("../db");

module.exports = class Lesson{
    collection = "quotes";

    getName(){
        return "Michel";
    }
    
    async getQuotes(){
        let client = null;
        try{
            client = await Db.connect();
            const db = client.db(Db.dbName);
            const collection = db.collection(this.collection);
            const quotes = await collection.find({}).toArray();

            return quotes;
        } catch (error) {
            throw error;
        }finally{
            if(client){
                await client.close();
                client = null;
            }
        }
    }

    async insert(client, data){
        let session = null;
        try {
            if(client === null){
                client = await Db.connect();
            }
            session = client.startSession();
            session.startTransaction(Db.transactionOptions);
            const db = client.db(Db.dbName);
            const collection = db.collection(this.collection);
            await collection.insertOne(
                {
                    name : data.name,
                    quote : data.quote
                },
                {
                    session
                }
            );

            await collection.insertOne(
                {
                    name : "test",
                    quote : data.quote
                },
                {
                    session
                }
            );

            await session.commitTransaction();

            return {
                "message" : "All things inserted"
            }
        } catch (error) {
            if(session){
                await session.abortTransaction();
            }
            return {
                "message" : error.message
            };
        }finally{
            if(session){
                await session.endSession();
                session = null;
            }
            if(client){
                await client.close();
                client = null;
            }
        }
    }

    async update(client, data){
        let session = null;
        try {
            if(client === null){
                client = await Db.connect();
            }
            session = client.startSession();
            session.startTransaction(Db.transactionOptions);
            const db = client.db(Db.dbName);
            const collection = db.collection(this.collection);
            await collection.updateOne(
                {
                    name : data.name // Filter
                },
                {
                    $set : {
                        quote : data.quote
                    }
                },
                {
                    session
                }
            );

            await collection.updateOne(
                {
                    name : "test"
                },
                {
                    $set : {
                        quote : "this is a modified quote"
                    }
                },
                {
                    session
                }
            );

            await session.commitTransaction();

            return {
                "message" : "Modified successfully"
            }
        } catch (error) {
            if(session){
                await session.abortTransaction();
            }
            return {
                "message" : error.message
            };
        }finally{
            if(session){
                await session.endSession();
                session = null;
            }
            if(client){
                await client.close();
                client = null;
            }
        }
    }

    async delete(client, data){
        let session = null;
        try {
            if(client === null){
                client = await Db.connect();
            }
            session = client.startSession();
            session.startTransaction(Db.transactionOptions);
            const db = client.db(Db.dbName);
            const collection = db.collection(this.collection);
            await collection.deleteOne(
                {
                    name : data.name // Filter
                },
                {
                    session
                }
            );

            await collection.deleteOne(
                {
                    name : "test"
                },
                {
                    session
                }
            );

            await session.commitTransaction();

            return {
                "message" : "Deleted successfully"
            }
        } catch (error) {
            if(session){
                await session.abortTransaction();
            }
            return {
                "message" : error.message
            };
        }finally{
            if(session){
                await session.endSession();
                session = null;
            }
            if(client){
                await client.close();
                client = null;
            }
        }
    }
}