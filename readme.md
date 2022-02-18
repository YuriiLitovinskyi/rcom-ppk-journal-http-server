## HTTP server for getting device data from RCOM journal
***  
### Setup project:
&emsp;`npm i mongodb@2.2.33`  
&emsp;`npm i chalk@4.0.0`  
&emsp;`npm i`     
&emsp;`npm i pkg -g`

### Run project:
&emsp;`node server.js`

### Create .exe file for win x64:  
&emsp;`pkg server.js --targets=latest-win-x64 --output rcom-ppk-journal-http-server`  
### Create .exe file for win x86:  
&emsp;`pkg server.js --targets=latest-win-x86 --output rcom-ppk-journal-http-server`
***