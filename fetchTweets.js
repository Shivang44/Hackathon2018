const Twitter = require('twitter');
const config = require('./config/keyConfig');
const fs = require('fs');

var client = new Twitter({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token_key: config.accessToken,
    access_token_secret: config.tokenSecret
});

var requestScanning = [
    { user: "ohackathon2018",  userID: 123, sinceID: 1 }
]; //contains a users request for twitter profile to scan


setInterval(() => {
    console.log("Fetching tweets.");
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
            var messagesToSend = [];

            tweets.forEach(tweet => {
                //console.log(tweet.text);
                messagesToSend.push(tweet.text);
            });

            req.sinceID = tweets.length > 0 ? tweets[0].id : req.sinceID; //only update sinceID if tweets are found
            fs.writeFile('./data/tweets.json', JSON.stringify(messagesToSend), (err) => {
                if (err) {
                    console.log("error writing file.");
                }
            });

        });
        // console.log("sinceID::" + params.since_id);
    });

}, 10000);
