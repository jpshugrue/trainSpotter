const request = require('request');
const GtfsRealtimeBindings = require('../gtfs/gtfs-realtime');
const config = require('./config');

function pullData (callback) {
  let data = {};
  const requestSettings = {
    method: 'GET',
    url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}`,
    encoding: null
  };
  request(requestSettings, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      feed.entity.forEach((entity) => {
        if (entity.tripUpdate) {
          const tripId = cleanId(entity.tripUpdate.trip.tripId);
          if (!data[tripId]) {
            data[tripId] = {};
          }
          data[tripId]["tripUpdate"] = entity.tripUpdate;
        } else if (entity.vehicle) {
          const tripId = cleanId(entity.vehicle.trip.tripId);
          if (!data[tripId]) {
            data[tripId] = {};
          }
          data[tripId]["vehicle"] = entity.vehicle;
        }
      });
      data.header = feed.header;
      callback(data);
    }
  });
}

function cleanId (id) {
  return id.split('.').join('');
}

module.exports.pullData = pullData;
