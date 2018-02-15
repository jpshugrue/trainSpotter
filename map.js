import populateStops from './stops';

class Map {

  constructor(htmlMap) {
    this.htmlMap = htmlMap;
    populateStops((stops) => {
      this.stops = stops;
    });
  }

  populateMap() {

  }

}

export default Map;
