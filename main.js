import Map from './map';
import { getTrains } from './routes';
// import Trains from './trains';

function populateMap(htmlMap) {
  const map = new Map(htmlMap, () => {
    getTrains((trains) => {
      window.trains = trains;
      map.animateTrains(trains);
    });
  });
}

window.populateMap = populateMap;
window.getTrains = getTrains;
