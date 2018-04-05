import { generateRoutes, generateStops } from './routes';

class Map {

  constructor(htmlMap, callback) {
    this.htmlMap = htmlMap;
    this.trainCircs = [];
    generateRoutes((routes) => {
      this.routes = routes;
      generateStops((stops) => {
        this.stops = stops;
        this.animateStops();
        this.animateLines();
        setInterval(callback, 30000);
        callback();
        setInterval(this.moveTrains, 20);
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

  moveTrains() {
    //need to record some sort of concept of speed for the trains to know
    //over what distance to animate them
  }

  addListeners() {
    // google.maps.event.clearInstanceListeners(trainCirc);

    // circle.addListener('click', function() {
    //   console.log(`I am ${entityId}`);
    //   console.log(`My prevLat was ${prevCoord.lat} and prevLng was ${prevCoord.lng}`);
    //   console.log(`My nextLat was ${nextCoord.lat} and nextLng was ${nextCoord.lng}`);
    //   console.log(`My sequenceTime was ${sequenceTime} and remTime was ${remTime}`);
    //   console.log(`My fractionComplete was ${fractionComplete}`);
    //   console.log(`My result is lat ${newCoord.lat} and lng ${newCoord.lng}`);
    // });
  }

  animateTrains(feeds) {
    this.trainCircs.forEach((trainCirc) => {
      trainCirc.setMap(null);
    });
    this.trainCircs = [];
    // Object.keys(feeds).forEach((feedId) => {
      // const trains = feeds[feedId];
      const trains = feeds;
      // console.log(trains);
      Object.keys(trains).forEach((entityId) => {
        // console.log(entityId);
        const prevStop = this.stops[trains[entityId].prevStopId];
        // console.log(`prevstopID is ${trains[entityId].prevStopId}`);
        const sequenceTime = trains[entityId].sequenceTime - trains.header.timestamp.low;
        if (trains[entityId].prevStopId && prevStop) {
          console.log("We have a prevStop");
          const nextStop = this.stops[trains[entityId].tripUpdate.stopTimeUpdate[0].stopId];
          if (!nextStop) {
            console.log(`Couldn't find this stopID: ${trains[entityId].tripUpdate.stopTimeUpdate[0].stopId}`);
            return;
          }
          const prevCoord = { lat: parseFloat(prevStop.lat), lng: parseFloat(prevStop.lng)};
          const nextCoord = { lat: parseFloat(nextStop.lat), lng: parseFloat(nextStop.lng)};
          const etaTime = trains[entityId].tripUpdate.stopTimeUpdate[0].arrival.time.low;
          let remTime;
          if (etaTime >= trains.header.timestamp.low) {
            remTime = etaTime - trains.header.timestamp.low;
          } else {
            remTime = 0;
          }
          let fractionComplete;
          if (sequenceTime <= 0) {
            fractionComplete = 0.99;
          } else {
            fractionComplete = 1 - (remTime / sequenceTime);
            if (fractionComplete < 0) {
              fractionComplete = 0;
            }
          }
          const newCoord = { lat: ((nextCoord.lat - prevCoord.lat) * fractionComplete) + prevCoord.lat,
                             lng: ((nextCoord.lng - prevCoord.lng) * fractionComplete) + prevCoord.lng};
          const circle = new google.maps.Circle({
            strokeColor: "black",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "black",
            fillOpacity: 0.35,
            map: this.htmlMap,
            center: newCoord,
            radius: 50
          });
          this.trainCircs.push(circle);
        }
        // else {
        //   if (!trains[entityId].prevStopId) {
        //     console.log(`${entityId} does not yet have a prevStop`);
        //   } else if (!prevStop) {
        //     console.log(`this.stops doesn't contain ${trains[entityId].prevStopId}`);
        //   }
        // }
      });
    // });

  }
}

export default Map;
