const GtfsRealtimeBindings = require('../gtfs/gtfs-realtime');
const config = require('./config');
const http = require("http");

function pullData (callback) {
  // let data;
  const feedIds = [];

  const baseURL = `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=`;
  // 1 to 6 and 42nd St Shuttle
  feedIds.push('1');
  // A,C,E,H and Franklin Ave Shuttle
  feedIds.push('26');
  // // N,Q,R,W
  feedIds.push('16');
  // // B,D,F,M
  feedIds.push('21');
  // // L
  feedIds.push('2');
  // // G
  feedIds.push('31');
  // // J,Z
  feedIds.push('36');
  // // 7
  feedIds.push('51');
  // // Staten Island Railway
  feedIds.push('11');

  feedIds.forEach((feedId) => {
    console.log(`Data pull for ${feedId} feedId`);
    // data = {};
    const completeURL = baseURL+feedId;
    http.get(completeURL, (res) => {
      const data = {};

    	let body = []; // List of Buffer objects
    	res.on("data", function(chunk) {
    		body.push(chunk); // Append Buffer object
    	});
    	res.on("end", function() {
    		body = Buffer.concat(body); // Make one large Buffer of it
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
        console.log(`Number of keys in data: ${Object.keys(data).length}`);
        callback(data, feedId);
    	});
    });
  });
}

function cleanId (id) {
  return id.split('.').join('');
}

module.exports.pullData = pullData;
