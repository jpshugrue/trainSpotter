const $ = require('jquery');
export const generateRoutes = (callback) => {
  $.ajax({
    url: 'http://localhost:3000/lines.json',
    success: (data) => {
      callback(data);
    }
  });
};

// export const generateSequences = (callback) => {
//   $.ajax({
//     url: 'http://localhost:3000/sequences.json',
//     success: (data) => {
//       callback(data);
//     }
//   });
// };

export const generateStops = (callback) => {
  $.ajax({
    url: 'http://localhost:3000/stops.json',
    success: (data) => {
      callback(data);
    }
  });
};

// export const generateTrips = (callback) => {
//   $.ajax({
//     url: 'http://localhost:3000/trips.json',
//     success: (data) => {
//       callback(data);
//     }
//   });
// };

export const getTrains = (callback) => {
  $.ajax({
    url: 'http://localhost:3000/trains',
    success: (data) => {
      callback(data);
    }
  });
};

// export const getHeader = (callback) => {
//   $.ajax({
//     url: 'http://localhost:3000/header',
//     success: (data) => {
//       callback(data);
//     }
//   });
// };
