const fs = require('fs'); 


const routes = [{
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
        var data = JSON.parse(fs.readFileSync("./data/tweets.json"));
        test = {
            test: '123'
        }
        return h.view('index', test); 

    }
}];

module.exports = routes;