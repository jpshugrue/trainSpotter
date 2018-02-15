// const $ = require('jquery');

// $(() => {
//   const script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAoQUTPYABfgN5HXYLEkW208dk3m3XpesM&callback=initMap';
//   document.getElementsByTagName('head')[0].appendChild(script);
// });

// let map;
// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//       center: {lat: 40.695444, lng: -73.942067},
//       zoom: 12
//   });
// }
//
// window.initMap = initMap;
//
// export default initMap();

function populateMap(map) {
  console.log("this will get called");
}

window.populateMap = populateMap;
