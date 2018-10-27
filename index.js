const Hapi = require('hapi');
const _= require('underscore');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});


const Twitter = require('twitter');
const config = require('./config/keyConfig');
var client = new Twitter({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token_key: config.accessToken,
    access_token_secret: config.tokenSecret
});

var requestScanning = [
    { user: "ohackathon2018",  userID: 123, sinceID: 1 }
]; //contains a users request for twitter profile to scan

var messagesToSend = [];

requestScanning.forEach(req => {
    var params = {
        screen_name: req.user,
        count: 50,
        since_id: req.sinceID
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log(error);
            return "error";
        }
        tweets.forEach(tweet => {
            if(tweet.place!=undefined){
                console.log(tweet.text);
                console.log(tweet.place);
                console.log(tweet.place.bounding_box.coordinates);
            }
            messagesToSend.push(tweet.text);
        });

        req.sinceID = tweets.length > 0 ? tweets[0].id : req.sinceID; //only update sinceID if tweets are found
    });
    // console.log("sinceID::" + params.since_id);
});


server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return messagesToSend;
    }
});

const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
