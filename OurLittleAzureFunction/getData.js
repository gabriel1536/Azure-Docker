const fs = require('fs');
const Twit = require('twit');

var T = new Twit({
  consumer_key: 'consumer_key',
  consumer_secret: 'consumer_secret',
  access_token: 'access_token',
  access_token_secret: 'access_token_secret',
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

function getData() {
    var last_id = 999999999999999999;
    let tname = "officialDannyT";

    let getNextBatch = function (n, last_id, arr) {
      if (n === 0) {
        fs.writeFile('data.txt', arr.join('\n'), function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
        return;
      }

      T.get('statuses/user_timeline', {
        screen_name: tname,
        count: 200, max_id: last_id - 101,
        exclude_replies: true,
        include_rts: false,
        trim_user: true,
        tweet_mode: 'extended'
      }, function (err, tweets, response) {
        if (err || tweets.length === 0) {
          if (tweets.length === 0) {
            console.log(tweets);
          }
          else {
            console.log("Ok with error.");
            this.resp = err.message;
          }
          getNextBatch(0, last_id, arr.concat([]));
        }
        else {
          console.log("len: " + tweets.length);
          last_id = tweets[tweets.length - 1].id;
          tweets = tweets.map(d => d.full_text);
          tweets = tweets.map(d => d.replace(/(@\S+)/gi, '').trim()); //these are "cleaners"
          tweets = tweets.map(d => d.replace(/(#\S+)/gi, '').trim());
          tweets = tweets.map(d => d.replace(/(https?:\/\/[^ ]*)/gi, '').trim());
          getNextBatch(n - 1, last_id, arr.concat(tweets));
        }
      });
    }

    getNextBatch(900, last_id, []);
}

getData();