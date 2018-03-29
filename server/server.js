const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const path = require('path');
const { pullData } = require('./trains.js');
const FirebaseConnector = require('./firebase.js');
const { processData } = require('./update.js');

const MongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb://localhost:27017/trains";

MongoClient.connect(mongoURL, (err, db) => {
  if (err) throw err;
  console.log("Connected to mongoDB");
  // db.close();
});

app.use(cors());

app.get('/lines.json', (req, res) => {
   res.sendFile(path.resolve('../static/custom/lines.json'));
});

app.get('/stops.json', (req, res) => {
   res.sendFile(path.resolve('../static/custom/stops.json'));
});

app.get('/trains', (req, res) => {
  firebase.getAllData((snapshot) => {
    res.json(snapshot.val());
  });
});

const firebase = new FirebaseConnector();
function trainPoll() {
  console.log("Polling");
  pullData((data, feedId) => {
    firebase.getData(feedId, (snapshot) => {
      const processed = processData(snapshot.val(), data);
      firebase.clearData(feedId);
      firebase.uploadData(processed, feedId);
    });
  });
}
setInterval(trainPoll, 30000);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
