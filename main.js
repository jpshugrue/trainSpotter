const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
const config = require('./config');
const requestSettings = {
  method: 'GET',
  url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}`,
  encoding: null
};
request(requestSettings, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const feed = GtfsRealtimeBindings.FeedMessage.decode(body);
    feed.entity.forEach((entity, index) => {
      if (entity.trip_update && index == 0) {
        console.log(entity.trip_update);
        console.log(entity.vehicle);
        console.log(entity.alert);
      }
    });
  }
});
