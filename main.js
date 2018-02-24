import Map from './map';
import Trains from './trains';

function populateMap(htmlMap) {
  const trains = new Trains();

  trains.pullData(() => {
    const map = new Map(htmlMap, trains);
    // map.animateTrains(trains);
  });
  window.trains = trains;
}

window.populateMap = populateMap;
