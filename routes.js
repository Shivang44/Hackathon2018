const fs = require('fs'); 


const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            var data = JSON.parse(fs.readFileSync("./data/tweets.json"));
            return data; 
        }  
    },
    {
        method: 'GET',
        path: '/markers',
        handler: (request, h) => {
            const tweetData = JSON.parse(fs.readFileSync('./data/sentimentAnalysis.json'));
            return tweetData;
        }
    }
];

module.exports = routes;