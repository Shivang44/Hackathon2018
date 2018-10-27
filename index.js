const Hapi = require('hapi');
const fs = require('fs'); 
const Vision = require('vision');
const routes = require('./routes.js');
const Handlebars = require('handlebars');
const tweetFetcher = require('./fetchTweets.js');

const server = new Hapi.server({
    port: 3000,
    host: 'localhost'
});


//
// server.register(Vision, function (err) {  
//     if (err) {
//       console.log('Cannot register vision')
//     }
  
//     // configure template support   
//     server.views({
//       engines: {
//         html: Handlebars
//       },
//       path: __dirname + '/views',
//       layout: 'layout'
//     })
//   })

server.route(routes);


const start = async () => {

    await server.register(Vision);
    
    server.views({
        engines: {
            html: require('handlebars')
            },
            layout: true,
            path: __dirname + '/views'
    });
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};


process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

start();

module.exports = {"hi": 5};