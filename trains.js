const request = require('request');
const GtfsRealtimeBindings = require('./gtfs/gtfs-realtime');

class Trains {

  constructor() {
    this.header = null;
    this.trains = {};
  }

  pullData(callback) {
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
            if (!this.trains[entity.tripUpdate.trip.tripId]) {
              this.trains[entity.tripUpdate.trip.tripId] = {};
            }
            this.trains[entity.tripUpdate.trip.tripId]["tripUpdate"] = entity.tripUpdate;
          } else if (entity.vehicle) {
            if (!this.trains[entity.vehicle.trip.tripId]) {
              this.trains[entity.vehicle.trip.tripId] = {};
            }
            this.trains[entity.vehicle.trip.tripId]["vehicle"] = entity.vehicle;
          } 
        });
        this.header = feed.header;
        callback();
      }
    });
  }
}

export default Trains;
