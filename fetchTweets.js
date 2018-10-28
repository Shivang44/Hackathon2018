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
    { user: "ohackathon2018",  userID: 123, since_id: 1}
]; //contains a users request for twitter profile to scan

var tweetsMap = {};

setInterval(() => {
    requestScanning.forEach(req => {

        var params = {
            screen_name: req.user,
            count: 50,
            since_id: req.since_id
        };

        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (error) {
                console.log(error);
                return "error";
            }

            var fetchedTweets = [];

            tweets.forEach(tweet => {
                fetchedTweets.push({
                    id: tweet.id,
                    text: tweet.text,
                    location: tweet.geo == null ? null : tweet.geo.coordinates
                });
            });
            
            var counter = 0;
            if (!fs.existsSync('./data/tweets.json')) {
                // Add all to tweetmap
                fetchedTweets.forEach((tweet) => {
                    tweetsMap[tweet.id] = true;
                });

                counter = fetchedTweets.length;

                // Initial case, rewrite all tweets
                fs.writeFileSync('./data/tweets.json', JSON.stringify(fetchedTweets));
                console.log("Initial run. Fetched all tweets and wrote to tweets.json");
            } else {
                // Difference update, add new teets
                var oldTweets = JSON.parse(fs.readFileSync('./data/tweets.json'));

                fetchedTweets.forEach((tweet) => {
                    if (!tweetsMap.hasOwnProperty(tweet.id)) {
                        // Not in map yet so not in tweets.json, add it.
                        oldTweets.push(tweet);
                        counter++;
                    }

                    tweetsMap[tweet.id] = true;                    
                });

                fs.writeFileSync('./data/tweets.json', JSON.stringify(oldTweets));
                console.log("Fetched and added " + counter + " tweets not in tweets.json");


            }
            
            
            if (counter > 0) {
                tweetAnalyzer.getSetiments(tweetAnalyzer.getTweetData());

                // Update tweets to be all analyzed
                var tweets = JSON.parse(fs.readFileSync('./data/tweets.json'));
                tweets.forEach((tweet) => {
                    tweet.hasBeenAnalyzed = true;
                });
                fs.writeFileSync('./data/tweets.json', JSON.stringify(tweets));    
            }





        });
    });

}, 5 * 1000);
