const request = require('request');
const GtfsRealtimeBindings = require('../gtfs/gtfs-realtime');
const config = require('./config');

function pullData (callback) {
  let data = {};
  const requestURLs = [];
  // 1 to 6 and 42nd St Shuttle
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=1`);
  // A,C,E,H and Franklin Ave Shuttle
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=26`);
  // N,Q,R,W
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=16`);
  // B,D,F,M
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=21`);
  // L
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=2`);
  // G
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=31`);
  // J,Z
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=36`);
  // 7
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=51`);
  // Staten Island Railway
  requestURLs.push(`http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=11`);

  const requestSettings = [];
  requestURLs.forEach((url) => {
    requestSettings.push({
      method: 'GET',
      url: url,
      encoding: null
    });
  });
  // const oneThroughSixRequest = {
  //   method: 'GET',
  //   url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=1`,
  //   encoding: null
  // };
  requestSettings.forEach((requestSetting) => {
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
      } else {
        console.log("Error in pullData server request");
      }
    });
  });
  // request(requestSettings, (error, response, body) => {
  //   if (!error && response.statusCode == 200) {
  //     const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
  //     feed.entity.forEach((entity) => {
  //       if (entity.tripUpdate) {
  //         const tripId = cleanId(entity.tripUpdate.trip.tripId);
  //         if (!data[tripId]) {
  //           data[tripId] = {};
  //         }
  //         data[tripId]["tripUpdate"] = entity.tripUpdate;
  //       } else if (entity.vehicle) {
  //         const tripId = cleanId(entity.vehicle.trip.tripId);
  //         if (!data[tripId]) {
  //           data[tripId] = {};
  //         }
  //         data[tripId]["vehicle"] = entity.vehicle;
  //       }
  //     });
  //     data.header = feed.header;
  //     callback(data);
  //   } else {
  //     console.log("Error in pullData server request");
  //   }
  // });
}

function cleanId (id) {
  return id.split('.').join('');
}

module.exports.pullData = pullData;
