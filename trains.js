const request = require('request');
const GtfsRealtimeBindings = require('./gtfs/gtfs-realtime');
import populateStops from './stops';

class Trains {

  constructor() {
    this.trains = [];
    populateStops((stops) => {
      this.stops = stops;
    });
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

// window.trains = Trains;
// const trains = new Trains();
// trains.pullData();
// window.trains = trains;

export default Trains;
