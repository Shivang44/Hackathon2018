const Hapi = require('hapi');
const fs = require('fs'); 
const routes = require('./routes.js');
const tweetFetcher = require('./fetchTweets.js');
//const tweetAnalyzer = require('./tweetAnalyzer.js');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});


server.route(routes);

const init = async () => {
    await server.register(require('vision'));

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });


    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

module.exports = {"hi": 5};