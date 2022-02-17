const fs = require('fs');


function readConfigFile(cb){   
    if(!fs.existsSync('config.json')){
        console.log('Error: config.json file not found');            
    } else {
        fs.readFile('config.json', 'utf8', (err, data) => {
            if(err) console.log(err.message);

            console.log('Reading config file successfully');

            return cb(JSON.parse(data));
        });
    };
};


module.exports = readConfigFile;