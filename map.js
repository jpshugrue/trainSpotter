import { generateRoutes, generateTrips } from './routes';

class Map {

  constructor(htmlMap) {
    this.htmlMap = htmlMap;
    generateRoutes((routes) => {
      this.routes = routes;
      this.animateStops();
      this.animateLines();
      // generateTrips((trips) => {
      //   this.trips = trips;
      //   this.animateTrains(trains);
      // });
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
        const prevLat = this.routes[route].stops[prevStop].lat;
        const prevLng = this.routes[route].stops[prevStop].lng; 
        const nextLat = this.routes[route].stops[nextStop].lat;
        const nextLng = this.routes[route].stops[nextStop].lng;
        const plannedTime =
      }
    });
  }

  // animateTrains(trains) {
  //   Object.keys(trains.trains).forEach((trainKey) => {
  //     const train = trains.trains[trainKey];
  //     // console.log(train);
  //   // });
  //   // trains.trains.forEach((train) => {
  //     //for each train, figure out where it is coming
  //     //from based on trip id and destination
  //     //use that to check normal total time for that
  //     //sequence
  //     const tripId = train.tripUpdate.trip.tripId;
  //     const destination = train.tripUpdate.stopTimeUpdate[0].stopId;
  //
  //     if (this.trips[tripId] && this.trips[tripId][destination]) {
  //       // console.log(this.trips[tripId]);
  //       // console.log(`Looking for destination ${destination}`);
  //       const origin = this.trips[tripId][destination].origin;
  //       const schedTime = this.trips[tripId][destination].time;
  //       //check ETA to destination
  //       const actualETA = train.tripUpdate.stopTimeUpdate[0].arrival.time;
  //       const remTime = trains.header.timestamp - actualETA;
  //       //find percentage traveled with ETA and norm
  //       const percentage = parseFloat(remTime) / schedTime;
  //       //animate along that route based on %
  //       const route = train.tripUpdate.trip.routeId;
  //       const destLat = this.routes[route].stops[destination].lat;
  //       const destLng = this.routes[route].stops[destination].lng;
  //       const origLat = this.routes[route].stops[origin].lat;
  //       const origLng = this.routes[route].stops[origin].lng;
  //       console.log("Lat math");
  //       console.log(`DestLat is ${destLat} and origLat is ${origLat}`);
  //       console.log(`Percentage is ${percentage}`);
  //       console.log(`DestLat - OrigLat is ${destLat - origLat}`);
  //       console.log(`Times percentage it is ${percentage}`);
  //       const trainLat = ((destLat - origLat) * percentage) + origLat;
  //       console.log(`TrainLat is ${trainLat}`);
  //       const trainLng = ((destLng - origLng) * percentage) + origLng;
  //       console.log(`Successful train draw at ${trainLat} and ${trainLng}`);
  //       new google.maps.Circle({
  //         strokeColor: "black",
  //         strokeOpacity: 0.8,
  //         strokeWeight: 2,
  //         fillColor: "black",
  //         fillOpacity: 0.35,
  //         map: this.htmlMap,
  //         center: {lat: trainLat, lng: trainLng},
  //         radius: 20
  //       });
  //     } else {
  //       if (!this.trips[tripId]) {
  //         console.log(`Could not find tripId ${tripId}`);
  //       } else {
  //         console.log(`Cound not find destination ${destination} for tripId ${tripId}`);
  //       }
  //     }
  //   });
  // }
}

export default Map;
