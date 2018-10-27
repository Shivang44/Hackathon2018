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

        // Add tweet text and location to sentiment analysis
        const tweets = JSON.parse(fs.readFileSync('./data/tweets.json'));
        for (var i = 0; i < body_.documents.length; i++) {
            body_.documents[i]['text'] = tweets[i].text;
            body_.documents[i]['location'] = tweets[i].location;
        }


        let body__ = JSON.stringify (body_, null, '  ');
        console.log("Performed sentiment analysis on tweets and wrote to file.");

     

        fs.writeFileSync('./data/sentimentAnalysis.json', body__);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let get_sentiments = function (documents) {
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

    tweets.forEach((tweet, index) => {
        documents['documents'].push({
            'id': index,
            'language': 'en',
            'text': tweet.text
        });
    });

    return documents;
}

let documents = { 'documents': [
    { 'id': '1', 'language': 'en', 'text': 'I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable.' },
    { 'id': '2', 'language': 'es', 'text': 'Este ha sido un dia terrible, llegué tarde al trabajo debido a un accidente automobilistico.' },
]};

get_sentiments (getTweetData());
