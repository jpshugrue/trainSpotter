const request = require('request');
const GtfsRealtimeBindings = require('../gtfs/gtfs-realtime');

function pullData (callback) {
  let header = null;
  let trains = {};
  const requestSettings = {
    method: 'GET',
    url: `http://localhost:3000`,
    encoding: null,
  };
  request(requestSettings, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      feed.entity.forEach((entity) => {
        if (entity.tripUpdate) {
          if (!trains[entity.tripUpdate.trip.tripId]) {
            trains[entity.tripUpdate.trip.tripId] = {};
          }
          trains[entity.tripUpdate.trip.tripId]["tripUpdate"] = entity.tripUpdate;
        } else if (entity.vehicle) {
          if (!trains[entity.vehicle.trip.tripId]) {
            trains[entity.vehicle.trip.tripId] = {};
          }
          trains[entity.vehicle.trip.tripId]["vehicle"] = entity.vehicle;
        }
      });
      callback(feed.header, trains);
    }
  });
}

module.exports.pullData = pullData;
