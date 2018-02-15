import populateStops from './stops';

class Map {

  constructor(htmlMap) {
    this.htmlMap = htmlMap;
    // this.googleMaps = googleMaps;
    populateStops((stops) => {
      this.stops = stops;
      this.animateStops();
    });
  }

  animateStops() {
    this.stops.forEach((stop) => {
      new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: this.htmlMap,
          center: {lat: stop.lat, lng: stop.lng},
          radius: 10
        });
    });
  }

}

export default Map;
