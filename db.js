const MongoClient = require('mongodb').MongoClient;

function connectDb(url){
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, async (err, db) => {
            if(err){
                reject('No connection to Database: ', err);                             
            };
        
            resolve(db);
        });
    });
};

module.exports = connectDb;