import { generateRoutes, generateTrips } from './routes';

class Map {

  constructor(htmlMap) {
    this.htmlMap = htmlMap;
    generateRoutes((routes) => {
      this.routes = routes;
      this.animateStops();
      this.animateLines();
      generateTrips((trips) => {
        this.trips = trips;
      });
    });
  }

  animateStops() {
    Object.keys(this.routes).forEach((routeId) => {
      Object.keys(this.routes[routeId].stops).forEach((stopId)=> {
        const lat = parseFloat(this.routes[routeId].stops[stopId].lat);
        const lng = parseFloat(this.routes[routeId].stops[stopId].lng);
        const color = this.routes[routeId].color;
        new google.maps.Circle({
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.35,
          map: this.htmlMap,
          center: {lat: lat, lng: lng},
          radius: 30
        });
      });
    });
  }

  animateLines() {
    Object.keys(this.routes).forEach((routeId) => {
      const pairs = [];
      this.routes[routeId].sequences.forEach((sequence) => {
        const departId = sequence[0];
        const departLat = parseFloat(this.routes[routeId].stops[departId].lat);
        const departLng = parseFloat(this.routes[routeId].stops[departId].lng);
        const arriveId = sequence[1];
        const arriveLat = parseFloat(this.routes[routeId].stops[arriveId].lat);
        const arriveLng = parseFloat(this.routes[routeId].stops[arriveId].lng);
        pairs.push([{lat: departLat, lng: departLng}, {lat: arriveLat, lng: arriveLng}]);
      });
      pairs.forEach((pair) => {
        new google.maps.Polyline({
          map: this.htmlMap,
          path: pair,
          geodesic: true,
          strokeColor: this.routes[routeId].color,
          strokeOpacity: 1.0,
          strokeWeight: 1
        });
      });
    });
  }

  animateTrains(trains) {

  }

}

export default Map;
