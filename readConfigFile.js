const fs = require('fs');
const chalk = require('chalk');
const sleep = require('./sleep');

async function readConfigFile(cb){   
    if(!fs.existsSync('config.json')){
        console.log(chalk.red('Error: config.json file not found'));
        console.log('Application will be closed in 20 seconds')
        await sleep(20000);           
    } else {
        fs.readFile('config.json', 'utf8', async (err, data) => {
            if(err){
                console.log(chalk.red(err.message));
                console.log('Application will be closed in 20 seconds')
                await sleep(20000);
            };

            try {
                const config = JSON.parse(data);
                console.log('Reading config file successfully');    
                return cb(config);
            } catch (err) {
                console.log(chalk.red('config.json file is not a valid JSON file'));
                console.log(chalk.red(`Error: ${err.message}`));
                console.log('Application will be closed in 20 seconds');
                await sleep(20000);
            };
        });
    };
};

module.exports = readConfigFile;