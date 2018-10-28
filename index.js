const Hapi = require('hapi');
const fs = require('fs'); 
const routes = require('./routes.js');
const tweetFetcher = require('./fetchTweets.js');
//const tweetAnalyzer = require('./tweetAnalyzer.js');

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
});

// Delete if files exist
try {
    fs.unlinkSync('./data/tweets.json');
    fs.unlinkSync('./data/sentimentAnalysis.json');
} catch (Error) {}



const init = async () => {
    await server.register(require('vision'));
    await server.register(require('inert'));




    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.route(routes);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

module.exports = {"hi": 5};