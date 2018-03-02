import { generateRoutes, generateSequences } from './routes';

class Map {

  constructor(htmlMap) {
    this.htmlMap = htmlMap;
    generateRoutes((routes) => {
      this.routes = routes;
      generateSequences((sequences) => {
        this.sequences = sequences;
        this.animateStops();
        this.animateLines();
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
    Object.keys(trains).forEach((entityId) => {
      if (trains[entityId].prevStopId) {
        const prevStop = trains[entityId].prevStopId;
        const nextStop = trains[entityId].tripUpdate.stopTimeUpdate[0].stopId;
        const route = trains[entityId].tripUpdate.trip.routeId;
        const prevLat = parseFloat(this.routes[route].stops[prevStop].lat);
        const prevLng = parseFloat(this.routes[route].stops[prevStop].lng);
        const nextLat = parseFloat(this.routes[route].stops[nextStop].lat);
        const nextLng = parseFloat(this.routes[route].stops[nextStop].lng);
        let schedTime;
        if (this.sequences[prevStop] && this.sequences[prevStop][nextStop]) {
          if (this.sequences[prevStop][nextStop].ALL) {
            schedTime = this.sequences[prevStop][nextStop].ALL;
          } else {
            const today = new Date();
            const dayOfWeek = today.getDay();
            if (dayOfWeek === 0) {
              // will need to change these to actually select based on remaining time and when we started
              schedTime = this.sequences[prevStop][nextStop].SUN;
            } else if (dayOfWeek === 6) {
              schedTime = this.sequences[prevStop][nextStop].SAT;
            } else {
              schedTime = this.sequences[prevStop][nextStop].WKD;
            }
          }
          const etaTime = trains[entityId].tripUpdate.stopTimeUpdate[0].arrival.time.low;
          const remTime = etaTime - trains.header.timestamp.low;
          const fractionComplete = 1 - (remTime / (schedTime[0]/1000));
          const newLat = ((nextLat - prevLat) * fractionComplete) + prevLat;
          const newLng = ((nextLng - prevLng) * fractionComplete) + prevLng;
          new google.maps.Circle({
             strokeColor: "black",
             strokeOpacity: 0.8,
             strokeWeight: 2,
             fillColor: "black",
             fillOpacity: 0.35,
             map: this.htmlMap,
             center: {lat: newLat, lng: newLng},
             radius: 20
           });
        } else {
          console.log("Found an unscheduled sequence");
        }

      }
    });
  }
}

export default Map;
