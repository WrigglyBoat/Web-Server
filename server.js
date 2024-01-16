
const logEvents = require('./logEvents') //custom module

const EventEmitter = require('events');

const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

class Emitter extends EventEmitter{};

//initialize obj
const myEmitter = new Emitter();

//define port
const PORT = process.env.PORT || 3500;

//function for serving 
const serveFile = async(filePath,contentType, response) => {
    try {
        const fileData = await fsPromises.readFile(filePath, 'utf8');
        response.writeHead(200, {'Content-Type': contentType});
        response.end();
    } catch (err) {
        console.error(err);
        response.statusCode = 500;
        response.end();
    }
}

//create server with request and response
const server = http.createServer((req, res) => {
    console.log(req.url + req.method);
    
    const extension = path.extname(req.url);

    let contentType;

    switch(extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    //Chained ternary statement
    let filePath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname,'views','index.html')
            : contentType === 'text/html' && req.url.slice -1 === '/'
                ? path.join(__dirname,'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname,'views',req.url)
                    : path.join(__dirname. req.url);

    //makes the .html extension not required in browser
    if(!extension && req.url.slice -1 != '/') filePath += '.html';

    //checks if file exists
    const fileExist = fs.existsSync(filePath);

    if(fileExist) {
        //serve file 
        serveFile(filePath, contentType, res);
    } else {
        //404 ERROR 
        //301 REDIRECT
        switch(path.parse(filePath).base) { //will show diff parts of file path
            case 'old-page.html':
                res.writeHead(301, {'location':
                '/index.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'location':
                '/' });
                res.end();
                break;
            default:
                serveFile(path.join(__dirname,'views','404.html'), 'text/html', res);
        }
    }
});


server.listen(PORT, () => console.log('Server Running on port ' + PORT)); //Always put at the end of a server

// //add listener for the log event

// myEmitter.on('log',(msg) => logEvents(msg)); //event name in ()

// setTimeout(() => {
//     myEmitter.emit('log', 'Log Event emitted!');

// },2000);