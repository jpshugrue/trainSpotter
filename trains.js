const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
const config = require('./config');

module.exports = class Trains {

  constructor() {
    this.trains = [];
  }

  pullData(trainLine = '1') {
    const requestSettings = {
      method: 'GET',
      url: `http://datamine.mta.info/mta_esi.php?key=${config.mtaKey}&feed_id=${trainLine}`,
      encoding: null
    };
    request(requestSettings, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const feed = GtfsRealtimeBindings.FeedMessage.decode(body);
        feed.entity.forEach((entity) => {
          this.trains.push(entity);
        });
      }
    });
  }
};
