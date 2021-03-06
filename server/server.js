const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const path = require('path');
const { pullData } = require('./trains.js');
const { processData } = require('./update.js');
const redis = require('redis');
const client = redis.createClient();

app.use(cors());

app.get('/lines.json', (req, res) => {
   res.sendFile(path.resolve('../static/custom/lines.json'));
});

app.get('/stops.json', (req, res) => {
   res.sendFile(path.resolve('../static/custom/stops.json'));
});

app.get('/trains', (req, res) => {
  client.keys("*", (err, keys) => {
    client.mget(keys, (mGetErr, reply) => {
      const result = {};
      reply.forEach((feedObj) => {
        Object.assign(result, JSON.parse(feedObj));
      });
      res.json(result);
    });
  });
});

function trainPoll() {
  console.log("Polling");
  pullData((data, feedId) => {
    client.get(feedId, (getErr, getReply) => {
      const processed = processData(JSON.parse(getReply), data);
      client.set(feedId, JSON.stringify(processed), (setErr, setReply) => {
        console.log(`${setReply} on ${feedId}`);
      });
    });
  });
}
setInterval(trainPoll, 30000);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
