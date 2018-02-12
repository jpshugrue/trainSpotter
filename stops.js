const fs = require("fs");
const readLine = require('readline');

const populateStops = (callback) => {
  const rl = readLine.createInterface({
    input: fs.createReadStream('./static/stops.txt')
  });

  const stops = [];
  rl.on('line', (line) => {
    const stop = {};
    const lineData = line.split(",");
    stop.stop_id = lineData[0];
    stop.stop_name = lineData[2];
    stop.lat = lineData[4];
    stop.long = lineData[5];
    stop.parent = lineData[9];
    stops.push(stop);
  });
  rl.on('close', () => {
    callback(stops);
  });
};

module.exports = populateStops;
