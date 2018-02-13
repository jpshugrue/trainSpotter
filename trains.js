const request = require('request');
const config = require('./config');
const GtfsRealtimeBindings = require('./gtfs-realtime');

class Trains {

  constructor() {
    this.trains = [];
  }

  // 1,2,3,4,5,6,S(42ndStShuttle) = '1'
  // A,C,E = '26'
  // N,Q,R,W = '16'
  // B,D,F,M = '21'
  // L = '2'
  // G = '31'
  // J, Z = '36'
  // 7 = '51' (In Beta)
  pullData(trainLine) {
    const requestSettings = {
      method: 'GET',
      url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=${trainLine}`,
      encoding: null
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

export default Trains;
