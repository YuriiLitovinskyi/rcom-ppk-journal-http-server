const express = require('express');
const { validationResult } = require('express-validator');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const format = require("node.date-time");
const chalk = require('chalk');

const readConfigFile = require('./readConfigFile');
const sleep = require('./sleep');
const connectDb = require('./db');
const rules = require('./validatorRules');
const { convertIdMessage, convertLineMessage, enabledStatus } = require('./messages');

const version = '1.0.0';
let db;
let configData;

const app = express();

app.use(express.json({ extended: false }));

// Set sequrity headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    next();
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 mins
    max: 100 // 100 requests per 10 minutes
});

app.use(limiter);

// Error handler
app.use((err, req, res, next) => {
    if(err){
        console.log(err.message)
        return res.status(500).json({ success: false, errors: err.message });
    };
    next();
});

app.get('/api/ppkinfo/version', (req, res) => {
    res.json({ success: true, version });   
});

app.post('/api/ppkinfo/:ppk_num', [rules], async (req, res) => {
    const ppk_num = Number(req.params.ppk_num);    
    const { companyId, start_time, end_time } = req.body;

    if(isNaN(ppk_num) || ppk_num <= 0){
        return res.status(400).json({ 
            success: false, 
            errors: 'Param ppk_num must be numeric and greater then 0' 
        });
    };
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {        
        return res.status(422).json({ success: false, errors: errors.array() });       
    };

    let comp = configData.companies.filter(c => c.companyId === companyId);
    if(comp.length === 0){
        return res.status(400).json({ 
            success: false, 
            errors: 'Value companyId does not match or does not exist in config.json file!' 
        });
    } else if(comp.length > 1){       
        return res.status(500).json({ 
            success: false, 
            errors: 'Error in config.json file on the server side! Company ID must be unique!' 
        });
    } else {       
        if(!comp[0].ppk.includes(ppk_num)){          
            return res.status(400).json({ 
                success: false, 
                errors: `Device ${ppk_num} not found in config.json file for your company!` 
            });
        };

        try {
            const ppkData = await findPpkData(ppk_num, companyId, start_time, end_time);
    
            ppkData.forEach(ppk => {
                ppk.id_msg = convertIdMessage(ppk.id_msg);
                ppk.line = convertLineMessage(ppk.line);
                ppk.enabled = enabledStatus(ppk.enabled);
            });    
    
            res.status(200).json({ success: true, data: ppkData });
            
        } catch (err) {
            console.log(`Error! ${err.message}`);
            return res.status(500).json({ success: false, errors: err.message });
        };
    };
});

// Handle not existing routes
app.use((req, res, next) => {
    return res.status(404).json({ success: false, errors: 'Route does not exist!' });
});


function findPpkData(ppk_num, companyId, start_time, end_time){
    return new Promise((resolve, reject) => {
        db.collection('Journal', async (err, collection) => {
            if(err) reject(err);

            try {
                await collection.find({ 
                    ppk_num, 
                    date_time: {
                        $gte: new Date(start_time), 
                        $lt: new Date(end_time)
                    }}, 
                    {_id: 0})
                    .toArray(async (err, data) => {
                        if(err) reject(err);
        
                        console.log(chalk.yellow(`Processing request for companyId: ${companyId}, ppk: ${ppk_num} at ${new Date().format("Y-MM-dd HH:mm:SS")}`));
                        resolve(data);
                    });                
            } catch (err) {
                reject(err);
            };
        });
    });
};


readConfigFile(async (config) => {
    app.listen(config.serverPort, async () => {
        configData = config;
        console.log(`Server is listening port ${config.serverPort}`);
        
        try {
            const url = `mongodb://${config.mongoHost}:${config.mongoPort}/DBClientsPPK`;
    
            db = await connectDb(url);
            console.log('Connected to MongoDB');            
        } catch (err) {      
            console.log(chalk.red(`Error: ${err}`));
            console.log('Application will be closed in 20 seconds');
            await sleep(20000);
            process.exit(1);     
        };
    }).on('error', async (err) => {
        console.log(chalk.red(`Error: ${err.message}`));
        console.log('Application will be closed in 20 seconds');
        await sleep(20000); 
    });
});