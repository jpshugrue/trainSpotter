const request = require('request');
const GtfsRealtimeBindings = require('./gtfs/gtfs-realtime');

class Trains {

  constructor() {
    this.header = null;
    this.trains = [];
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
          this.trains.push(entity);
        });
        this.header = feed.header;
        callback();
      }
    });
  }
}

export default Trains;
