const util = require('util');

function processData (prevData, newData) {
  console.log("Starting data processing");
  const result = newData;
  Object.keys(result).forEach((tripId) => {
    if (prevData[tripId] && prevData[tripId].tripUpdate) {
      const prevNextStop = prevData[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      const newNextStop = result[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      if (prevNextStop !== newNextStop) {
        result[tripId].prevStopId = prevNextStop;
        // console.log(util.inspect(newData[tripId], {showHidden: false, depth: null}));
        if (newData[tripId].tripUpdate.stopTimeUpdate[0].arrival) {
          result[tripId].sequenceTime = newData[tripId].tripUpdate.stopTimeUpdate[0].arrival.time.low;
        } else {
          result[tripId].sequenceTime = newData[tripId].tripUpdate.stopTimeUpdate[0].departure.time.low;
        }
      } else if (prevData[tripId].prevStopId) {
        result[tripId].prevStopId = prevData[tripId].prevStopId;
        result[tripId].sequenceTime = prevData[tripId].sequenceTime;
      }
    }
  });
  console.log("End data processing");
  return result;
}

module.exports.processData = processData;
