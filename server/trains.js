const request = require('request');
const GtfsRealtimeBindings = require('../gtfs/gtfs-realtime');
const config = require('./config');

function pullData (callback) {
  let data = {};
  const requestSettings = {
    // method: 'GET',
    // url: `http://localhost:3000`,
    // encoding: null,
    method: 'GET',
    url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}`,
    encoding: null
  };
  request(requestSettings, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      feed.entity.forEach((entity) => {
        if (entity.tripUpdate) {
          if (!data[entity.tripUpdate.trip.tripId]) {
            data[entity.tripUpdate.trip.tripId] = {};
          }
          data[entity.tripUpdate.trip.tripId]["tripUpdate"] = entity.tripUpdate;
        } else if (entity.vehicle) {
          if (!data[entity.vehicle.trip.tripId]) {
            data[entity.vehicle.trip.tripId] = {};
          }
          data[entity.vehicle.trip.tripId]["vehicle"] = entity.vehicle;
        }
      });
      data.header = feed.header;
      callback(data);
    }
  });
}

module.exports.pullData = pullData;
