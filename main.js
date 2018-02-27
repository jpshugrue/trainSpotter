import Map from './map';
import { getTrains, getHeader } from './routes';
// import Trains from './trains';


function populateMap(htmlMap) {
  console.log("Gets here1");
  // const trains = {};
  const map = new Map(htmlMap);
  getTrains((trains) => {
    console.log("Gets here2");
    window.trains = trains;
  });


  // const trains = new Trains();
  //
  // trains.pullData(() => {
  //
  //   // map.animateTrains(trains);
  // });
  // window.trains = trains;
}

window.populateMap = populateMap;
window.getTrains = getTrains;
