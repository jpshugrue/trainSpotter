const $ = require('jquery');
export const populateStops = (callback) => {
  const stops = [];
  pullStops(stops, callback);
};

const pullStops = (stops, callback) => {
  return $.ajax({
    url: 'http://localhost:3000/stops.txt',
    success: (data) => {
      const lines = data.split('\n');
      lines.forEach((line) => {
        const stop = {};
        const lineData = line.split(",");
        stop.stop_id = lineData[0];
        stop.stop_name = lineData[2];
        stop.lat = parseFloat(lineData[4]);
        stop.lng = parseFloat(lineData[5]);
        stop.parent = lineData[9];
        stops.push(stop);
      });
      addLine(stops, callback);
    }
  });
};

const addLine = (stops, callback) => {
  const routes = {};
  return $.ajax({
    url: 'http://localhost:3000/lines.txt',
    success: (data) => {
      const lines = data.split('\n');
      lines.forEach((line) => {
        const lineData = line.split(",");
        routes[lineData[0]] = lineData.slice(1);
      });
      stops.forEach((stop) => {
        stop.route_id = [];
        Object.keys(routes).forEach((route_id) => {
          if(routes[route_id].includes(stop.stop_id)) {
            stop.route_id.push(route_id);
          }
        });
      });
      callback(stops);
    }
  });
};

// export default populateStops;
