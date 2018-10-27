const Twitter = require('twitter');
const config = require('./config/keyConfig');
const tweetAnalyzer = require('./tweetAnalyzer.js');
const fs = require('fs');

var client = new Twitter({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token_key: config.accessToken,
    access_token_secret: config.tokenSecret
});

var requestScanning = [
    { user: "ohackathon2018",  userID: 123 }
]; //contains a users request for twitter profile to scan


setInterval(() => {
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

            var fetchedTweets = [];

            tweets.forEach(tweet => {
                fetchedTweets.push({
                    text: tweet.text,
                    location: tweet.geo.coordinates
                });
            });

            //req.sinceID = tweets.length > 0 ? tweets[0].id : req.sinceID; //only update sinceID if tweets are found
            fs.writeFileSync('./data/tweets.json', JSON.stringify(fetchedTweets));
            console.log("Fetched and wrote tweet data to file.");
            
            tweetAnalyzer.getSetiments(tweetAnalyzer.getTweetData());


        });
        // console.log("sinceID::" + params.since_id);
    });

}, 5 * 1000);
