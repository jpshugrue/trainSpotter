const $ = require('jquery');
export const generateRoutes = (callback) => {
  $.ajax({
    url: 'http://localhost:3000/lines.json',
    success: (data) => {
      // const routes = JSON.parse(data);
      callback(data);
    }
  });
};
