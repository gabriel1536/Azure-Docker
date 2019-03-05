const fs = require('fs');
const path = require('path');
const Twit = require('twit');

const T = new Twit({
  consumer_key: 'pPH5avPVhPQb5V9wYHSWiNwT1',
  consumer_secret: 'tzVrIsXpra0oRE8GZA7YQpeBIcY28izXYrFk6faVi9WR61Libn',
  access_token: '839903041209921536-3fQxo6xl7w9OkwKT5DrEhIVat8PSGFP',
  access_token_secret: 'z7n9ZdpWden8ck8wi9u77LucxG3GnV9anrWV0B6YJbgGP',
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

module.exports = async function (context, req) {
  if (req.query.name || (req.body && req.body.name)) {
    var last_id = 9999999999;
    let tname = "" + req.query.name;
    let resp = "OK!";

    let getNextBatch = function (n, last_id, arr) {
      if (n == 0) {
        fs.writeFile('data.txt', arr.join('\n'), function (err) {
          if (!!err) {
            this.resp = err.message;
          }
        });
        return;
      }

      Ts.t.get('statuses/user_timeline', {
        screen_name: tname,
        count: 200, max_id: last_id - 101,
        exclude_replies: true,
        include_rts: false,
        trim_user: true,
        tweet_mode: 'extended'
      }, function (err, tweets, response) {
        if (err || tweets.length === 0) {
          getNextBatch(0, last_id, arr.concat([]));
          if (tweets.length === 0) {
            this.resp = "OK!"
          }
          else {
            this.resp = err.message;
          }
        }
        else {
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

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: "<h3>" + resp + "</h3>"
    };
  }
};