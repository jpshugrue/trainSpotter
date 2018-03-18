const request = require('request');
const GtfsRealtimeBindings = require('../gtfs/gtfs-realtime');
const config = require('./config');

function pullData (callback) {
  console.log("Gets here");
  let data = {};
  // const requestURLs = [];
  const feedIds = [];

  const baseURL = `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=`;
  // 1 to 6 and 42nd St Shuttle
  // requestURLs.push(baseURL+`1`);
  feedIds.push('1');
  // A,C,E,H and Franklin Ave Shuttle
  // requestURLs.push(baseURL+`26`);
  feedIds.push('26');
  // N,Q,R,W
  // requestURLs.push(baseURL+`16`);
  feedIds.push('16');
  // B,D,F,M
  // requestURLs.push(baseURL+`21`);
  feedIds.push('21');
  // L
  // requestURLs.push(baseURL+`2`);
  feedIds.push('2');
  // G
  // requestURLs.push(baseURL+`31`);
  feedIds.push('31');
  // J,Z
  // requestURLs.push(baseURL+`36`);
  feedIds.push('36');
  // 7
  // requestURLs.push(baseURL+`51`);
  feedIds.push('51');
  // Staten Island Railway
  // requestURLs.push(baseURL+`11`);
  feedIds.push('11');

  // const requestSettings = [];
  // requestURLs.forEach((url) => {
  //   requestSettings.push({
  //     method: 'GET',
  //     url: url,
  //     encoding: null
  //   });
  // });
  // const oneThroughSixRequest = {
  //   method: 'GET',
  //   url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=1`,
  //   encoding: null
  // };
  feedIds.forEach((feedId) => {
    // const requestSetting = [];
    // requestURLs.forEach((url) => {
    const requestSetting = {
        method: 'GET',
        url: baseURL+feedId,
        encoding: null
      };
    // });
    request(requestSetting, (error, response, body) => {
      console.log(`Requesting ${feedId}`);
      if (!error && response.statusCode == 200) {
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        feed.entity.forEach((entity) => {
          if (entity.tripUpdate) {
            console.log(`entity.tripUpdate.trip is ${entity.tripUpdate.trip}`);
            const tripId = cleanId(entity.tripUpdate.trip.tripId);
            if (!data[tripId]) {
              data[tripId] = {};
            }
            data[tripId]["tripUpdate"] = entity.tripUpdate;
          } else if (entity.vehicle) {
            console.log(`entity.vehicle.trip is ${entity.vehicle.trip}`);
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
