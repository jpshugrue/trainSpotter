const $ = require('jquery');
export const generateRoutes = (callback) => {
  $.ajax({
    url: 'http://localhost:3000/lines.json',
    success: (data) => {
      callback(data);
    }
  });
};
