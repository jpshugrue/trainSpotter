const $ = require('jquery');
const populateStops = (callback) => {
   const stops = [];
  $.ajax({
    url: './static/stops.txt',
    success: (data) => {
      const lines = data.split('\n');
      lines.forEach((line) => {
        const stop = {};
        const lineData = line.split(",");
        stop.stop_id = lineData[0];
        stop.stop_name = lineData[2];
        stop.lat = lineData[4];
        stop.long = lineData[5];
        stop.parent = lineData[9];
        stops.push(stop);
      });
      callback(stops);
    }
  });
};

export default populateStops;
