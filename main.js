import Map from './map';
import Trains from './trains';

function populateMap(htmlMap) {
  const trains = new Trains();
  const map = new Map(htmlMap);
  trains.pullData();
  window.trains = trains.trains;
}

window.populateMap = populateMap;
