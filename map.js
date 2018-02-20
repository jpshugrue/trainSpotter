import { generateRoutes } from './routes';

class Map {

  constructor(htmlMap) {
    this.htmlMap = htmlMap;
    generateRoutes((routes) => {
      this.routes = routes;
      this.animateStops();
    });
  }

  animateStops() {
    console.log(this.routes);
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
            radius: 20
          });
      });
    });
  }

}

export default Map;
