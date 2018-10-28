const fs = require('fs'); 


const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.view('index');
        }  
    },
    {
        method: 'GET',
        path: '/markers',
        handler: (request, h) => {
            const tweetData = JSON.parse(fs.readFileSync('./data/sentimentAnalysis.json'));
            return tweetData;
        }
    },
    {
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    }
];

module.exports = routes;