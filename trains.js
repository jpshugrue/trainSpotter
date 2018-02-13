const request = require('request');
const GtfsRealtimeBindings = require('./gtfs/gtfs-realtime');

class Trains {

  constructor() {
    this.trains = [];
  }

  pullData() {
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
      }
    });
  }
}

window.trains = Trains;

export default Trains;
