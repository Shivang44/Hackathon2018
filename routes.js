const fs = require('fs'); 


const routes = [{
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        var data = JSON.parse(fs.readFileSync("./tweets.json"));
        return data; 
    }
}];

module.exports = routes;