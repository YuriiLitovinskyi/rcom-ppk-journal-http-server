const express = require('express');
const { validationResult } = require('express-validator');

const readConfigFile = require('./readConfigFile');
const sleep = require('./sleep');
const connectDb = require('./db');
const rules = require('./validatorRules');
const { convertIdMessage, convertLineMessage, enabledStatus } = require('./messages');


let db;
let configData;
// const url = `mongodb://localhost:27017/DBClientsPPK`;

const app = express();

app.use(express.json({ extended: false }));

app.use((err, req, res, next) => {
    if(err){
        console.log(err.message)
        return res.status(500).json({ success: false, error: err.message });
    };
    next();
});

app.post('/rcom/ppkinfo', [rules], async (req, res) => {
    const { ppk_num, companyId, start_time, end_time } = req.body;
    //console.log(req.body);  
  
    // cors  
    // mongo disconnect?

    const errors = validationResult(req);
    if(!errors.isEmpty()) {        
        return res.status(422).json({ success: false, errors: errors.array() });       
    };

    let comp = configData.companies.filter(c => c.companyId === companyId);
    if(comp.length === 0){
        return res.status(400).json({ success: false, errors: 'companyId does not match or does not exists in config file' });
    } else if(comp.length > 1){
       
        return res.status(400).json({ success: false, errors: 'Error in config.json file! Company ID must be unique!' });
    } else {       
        if(!comp[0].ppk.includes(ppk_num)){          
            return res.status(400).json({ success: false, errors: `Device ${ppk_num} not found in config file for your company!` });
        };

        try {
            const ppkData = await findPpkData(ppk_num, start_time, end_time);
    
            ppkData.forEach(ppk => {
                ppk.id_msg = convertIdMessage(ppk.id_msg);
                ppk.line = convertLineMessage(ppk.line);
                ppk.enabled = enabledStatus(ppk.enabled);
            });
    
    
            res.json({ success: true, data: ppkData });
            
        } catch (err) {
            console.log(`Error! ${err.message}`);
            return res.status(500).json({ success: false, errors: err.message });
        };
    };
});

function findPpkData(ppk_num, start_time, end_time){
    return new Promise((resolve, reject) => {
        db.collection('Journal', async (err, collection) => {
            if(err) reject(err);

            try {
                await collection.find({ 
                    ppk_num, 
                    date_time: {$gte: new Date(start_time), $lt: new Date(end_time)}}, {_id: 0}).toArray(async (err, data) => {
                    if(err) reject(err);
    
                    console.log(`Processing request for ppk ${ppk_num} ...`);
                    resolve(data);
                });                
            } catch (err) {
                reject(err);
            };
        });
    });
};


readConfigFile((config) => {
    app.listen(config.serverPort, async () => {
        configData = config;
        console.log(`Server is listening port ${config.serverPort}`);
    
        try {               
            const url = `mongodb://${config.mongoHost}:${config.mongoPort}/DBClientsPPK`;
    
            db = await connectDb(url);
            console.log('Connected to MongoDB');
            
        } catch (err) {
            console.log(err);        
        };
    });
});