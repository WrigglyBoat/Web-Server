const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromise = require('fs').promises;   //Build in modules
const path = require('path');


const logEvents = async(message) => {
    const dateTime = format(new Date(), 'MM/dd/yyyy\t HH:mm:ss');
    const logItem = dateTime+'\t'+uuid()+'\t'+message; //\n can also go here
    console.log("Log Created")
    try {
        if(!fs.existsSync('./logs')) {
            fs.mkdir('./logs',(err) => {
                if(err) throw err;
                console.log('Directory Made');
            })
        }
        await fsPromise.appendFile(path.join(__dirname,'logs', 'eventlog.txt'),logItem+"\n");
    } catch (err){
        console.error(err);       
        //event changer
    }
}

module.exports = logEvents //exports our method