const Hapi = require('hapi');
const fs = require('fs'); 

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
            //console.log(tweet.text);
            messagesToSend.push(tweet.text);
        });

        req.sinceID = tweets.length > 0 ? tweets[0].id : req.sinceID; //only update sinceID if tweets are found
        fs.writeFile('tweets.json', JSON.stringify(messagesToSend), (err) => {
            if (err) {
                console.log("error writing file.");
            }
        });

    });
    // console.log("sinceID::" + params.since_id);
});


server.route(require('./routes.js'));

const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

module.exports = {"hi": 5};