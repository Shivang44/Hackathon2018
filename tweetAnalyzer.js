'use strict';

let https = require ('https');
const fs = require('fs');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
let accessKey = '342c59524aa74e40b71764fe4d454749';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.

let uri = 'westcentralus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/sentiment';

let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let body_ = JSON.parse (body);
        console.log("this is what microsoft sent back.", body_);

        // Add tweet text and location to sentiment analysis
        const tweets = JSON.parse(fs.readFileSync('./data/tweets.json'));

        // For each sentiment analysis, associate it with the correct id in tweets data
        for (var i = 0; i < body_.documents.length; i++) {
            var id = body_.documents[i].id;

            tweets.forEach((tweet) => {
                if (tweet.id == id) {
                    body_.documents[i].text = tweet.text;
                    body_.documents[i].location = tweet.location;
                }
            });

            // body_.documents[i]['text'] = tweets[i].text;
            // body_.documents[i]['location'] = tweets[i].location;
        }

        if (!fs.existsSync('./data/sentimentAnalysis.json')) {
            // Initial case. No sentiment analysis file yet. Write response to file.
            fs.writeFileSync('./data/sentimentAnalysis.json', JSON.stringify(body_)); // null, ' '
            console.log("No sentiment analysis file yet. Wrote to file.");
        } else {
            // File exists. Read it, add to it, write it back.
            var prevAnalysis = JSON.parse(fs.readFileSync('./data/sentimentAnalysis.json'));

           // console.log("Previous analysis was", prevAnalysis);

            body_.documents.forEach((tweet)=>{
                prevAnalysis.documents.push(tweet);
            });

           // console.log("new analysis is", body_);

            fs.writeFileSync('./data/sentimentAnalysis.json', JSON.stringify(prevAnalysis));

            console.log("Sentiment analysis file exists. Added to it and wrote back to file.");
        }
       
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let get_sentiments = function (documents) {
    console.log("These are the new tweets we are sending to analyze to microsoft.", documents);
    let body = JSON.stringify (documents);

    let request_params = {
        method : 'POST',
        hostname : uri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : accessKey,
        }
    };

    let req = https.request (request_params, response_handler);

    req.write (body);
    req.end ();
}

const getTweetData = function() {
    const tweets = JSON.parse(fs.readFileSync('./data/tweets.json'));
    let documents = {'documents': []};

    var counter=0;
    tweets.forEach((tweet, index) => {
        if(tweet.hasBeenAnalyzed == undefined || !tweet.hasBeenAnalyzed){
            documents['documents'].push({
                'id': tweet.id,
                'language': 'en',
                'text': tweet.text
            });
            counter++;
        }
    });


    console.log(counter+" tweets analyzed");
    return documents;
}

module.exports = {
    getSetiments: get_sentiments,
    getTweetData: getTweetData
};