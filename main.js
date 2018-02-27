import Map from './map';
import { getTrains, getHeader } from './routes';
// import Trains from './trains';


function populateMap(htmlMap) {
  const map = new Map(htmlMap);
  // getTrains((trains) => {
  //   window.trains = trains;
  // });
}

window.populateMap = populateMap;
window.getTrains = getTrains;
