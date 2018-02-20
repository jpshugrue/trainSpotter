const config = require('./config');
const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const path = require('path');
app.use(cors());

app.get('/lines.json', (req, res) => {
   res.sendFile(path.resolve('../static/custom/lines.json'));
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
