const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const path = require('path');
const { pullData } = require('./trains.js');
const FirebaseConnector = require('./firebase.js');
const { processData } = require('./update.js');

app.use(cors());

app.get('/lines.json', (req, res) => {
   res.sendFile(path.resolve('../static/custom/lines.json'));
});

// app.get('/trips.json', (req, res) => {
//    res.sendFile(path.resolve('../static/custom/trips.json'));
// });
const firebase = new FirebaseConnector();
function trainPoll() {
  pullData((data) => {
    firebase.getData((snapshot) => {
      const processed = processData(snapshot, data);
      firebase.clearData();
      firebase.uploadData(processed);
    });
  });
}
setInterval(trainPoll, 10000);

app.get('/trains', (req, res) => {
  //pull trains from firebase and return

  //req.json
});

// app.get('/header', (req, res) => {
//   //pull header from firebase and return
// });

// app.use('/', (req, res) => {
//   const requestSettings = {
//     method: 'GET',
//     url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}`,
//     encoding: null,
//   };
//   req.pipe(request(requestSettings)).pipe(res);
// });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
