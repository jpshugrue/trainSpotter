const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const path = require('path');
const { pullData } = require('./trains.js');
// const FirebaseConnector = require('./firebase.js');
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
  // firebase.getAllData((snapshot) => {
  //   res.json(snapshot.val());
  // });
});

// const firebase = new FirebaseConnector();
function trainPoll() {
  console.log("Polling");
  pullData((data, feedId) => {
    //data is coming in as object with keys being tripID's

    client.get('trains', (getErr, getReply) => {
      //lets try using json string represenation
      if (!(getReply === null)) {
        console.log(JSON.stringify(getReply));
        // const processed = processData(JSON.parse(getReply), data);
        // client.set('trains', processed, (setErr, setReply) => {
        //   console.log("Setting updated data");
        //   console.log(setReply);
        // });
      } else {
        console.log("Empty reply from db, first populate");
        client.set('trains', JSON.stringify(data), (setErr, setReply) => {
          console.log("Set new data with result");
          console.log(setReply);
        });
      }
    });


    // firebase.getData(feedId, (snapshot) => {
      // const processed = processData(snapshot.val(), data);
      // firebase.clearData(feedId);
      // firebase.uploadData(processed, feedId);
    // });
  });
}
setInterval(trainPoll, 5000);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
