const MongoClient = require('mongodb').MongoClient;
//const sleep = require('./sleep');

function connectDb(url){
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, async (err, db) => {
            if(err){
                reject('Error, no connection to Database: ', err);                             
            };
        
            resolve(db);
        });
    });
};

module.exports = connectDb;