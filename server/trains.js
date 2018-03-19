const request = require('request');
const GtfsRealtimeBindings = require('../gtfs/gtfs-realtime');
const config = require('./config');

function pullData (callback) {
  let data = {};
  const feedIds = [];

  const baseURL = `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=`;
  // 1 to 6 and 42nd St Shuttle
  feedIds.push('1');
  // A,C,E,H and Franklin Ave Shuttle
  feedIds.push('26');
  // N,Q,R,W
  feedIds.push('16');
  // B,D,F,M
  feedIds.push('21');
  // L
  feedIds.push('2');
  // G
  feedIds.push('31');
  // J,Z
  feedIds.push('36');
  // 7
  feedIds.push('51');
  // Staten Island Railway
  feedIds.push('11');

  feedIds.forEach((feedId) => {
    const requestSetting = {
        method: 'GET',
        url: baseURL+feedId,
        encoding: null
      };
    request(requestSetting, (error, response, body) => {
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
        callback(data, feedId);
      } else {
        console.log("Error in pullData server request");
      }
    });
  });
}

function cleanId (id) {
  return id.split('.').join('');
}

module.exports.pullData = pullData;
