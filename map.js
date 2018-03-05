import { generateRoutes, generateStops } from './routes';

class Map {

  constructor(htmlMap, callback) {
    this.htmlMap = htmlMap;
    generateRoutes((routes) => {
      this.routes = routes;
      generateStops((stops) => {
        this.stops = stops;
        this.animateStops();
        this.animateLines();
        setInterval(callback, 30000);
        // callback();
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
      const prevStop = this.stops[trains[entityId].prevStopId];
      const sequenceTime = trains[entityId].sequenceTime - trains.header.timestamp.low;
      if (trains[entityId].prevStopId && prevStop) {
        const nextStop = this.stops[trains[entityId].tripUpdate.stopTimeUpdate[0].stopId];
        const prevCoord = { lat: parseFloat(prevStop.lat), lng: parseFloat(prevStop.lng)};
        const nextCoord = { lat: parseFloat(nextStop.lat), lng: parseFloat(nextStop.lng)};

        const etaTime = trains[entityId].tripUpdate.stopTimeUpdate[0].arrival.time.low;
        const remTime = etaTime - trains.header.timestamp.low;
        const fractionComplete = 1 - (remTime / sequenceTime);
        const newCoord = { lat: ((nextCoord.lat - prevCoord.lat) * fractionComplete) + prevCoord.lat,
                            lng: ((nextCoord.lng - prevCoord.lng) * fractionComplete) + prevCoord.lng};
        new google.maps.Circle({
           strokeColor: "black",
           strokeOpacity: 0.8,
           strokeWeight: 2,
           fillColor: "black",
           fillOpacity: 0.35,
           map: this.htmlMap,
           center: newCoord,
           radius: 50
         });
         console.log(`Successful paint of ${entityId} at ${newCoord.lat} and ${newCoord.lng}`);
      } else {
        if (!trains[entityId].prevStopId) {
          // const nextStop = this.stops[trains[entityId].tripUpdate.stopTimeUpdate[0].stopId];
          // const nextCoord = { lat: parseFloat(nextStop.lat), lng: parseFloat(nextStop.lng)};
          // new google.maps.Circle({
          //    strokeColor: "black",
          //    strokeOpacity: 0.8,
          //    strokeWeight: 2,
          //    fillColor: "black",
          //    fillOpacity: 0.9,
          //    map: this.htmlMap,
          //    center: nextCoord,
          //    radius: 50
          //  });
          console.log(`${entityId} does not yet have a prevStop`);
        } else if (!prevStop) {
          console.log(`this.stops doesn't contain ${trains[entityId].prevStopId}`);
        }
      }
    });
  }
}

export default Map;
