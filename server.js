const express = require('express');

const sleep = require('./sleep');
const connectDb = require('./db');
const res = require('express/lib/response');

let db;


const url = 'mongodb://localhost:27017/DBClientsPPK';

const app = express();

app.use(express.json({ extended: false }));



app.post('/rcom/ppkinfo', async (req, res) => {
    const { ppk_num, companyId, start_time, end_time } = req.body;
    //console.log(req.body);

    // VALIDATION!
    // GET TIME INTERVALS
    
    const ppkData = await findPpkData(ppk_num);
    console.log(`Processing request for ppk ${ppk_num} ...`);

    res.json({ success: true, data: ppkData });
});



function findPpkData(ppk_num, start_time, end_time){
    return new Promise((resolve, reject) => {
        db.collection('Journal', async (err, collection) => {
            if(err) reject(err);

            await collection.find({ppk_num}, {_id: 0}).toArray(async (err, data) => {
                if(err) reject(err);

                resolve(data);
            });
        });
    });
};


const port = 4522;
app.listen(port, async () => {
    console.log(`Server is listening port ${port}`);

    try {
        db = await connectDb(url);
        console.log('Connected to MongoDB');
        
    } catch (err) {
        console.log(err);
    };
});