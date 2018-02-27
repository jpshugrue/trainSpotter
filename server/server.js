const config = require('./config');
const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const path = require('path');
const { pullData } = require('./trains.js');

app.use(cors());

app.get('/lines.json', (req, res) => {
   res.sendFile(path.resolve('../static/custom/lines.json'));
});

// app.get('/trips.json', (req, res) => {
//    res.sendFile(path.resolve('../static/custom/trips.json'));
// });

let header = {};
let trains = {};
function trainPoll() {
  pullData((newHeader, newTrains) => {
    header = newHeader;
    trains = newTrains;
    console.log("Data has been pulled");
  });
}
setInterval(trainPoll, 10000);

app.get('/trains', (req, res) => {
  res.json(trains);
   // res.write(JSON.stringify(trains));
});

app.get('/header', (req, res) => {
  debugger
  res.json(header);
  // console.log("Header is called");
  // console.log(header);
  //  res.write(JSON.stringify(header));
});

app.use('/', (req, res) => {
  const requestSettings = {
    method: 'GET',
    url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}`,
    encoding: null,
  };
  req.pipe(request(requestSettings)).pipe(res);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
