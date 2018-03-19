const util = require('util');

function processData (prevData, newData) {
  const result = newData;
  Object.keys(result).forEach((tripId) => {
    if (prevData && prevData[tripId] && prevData[tripId].tripUpdate) {
      const prevNextStop = prevData[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      const newNextStop = result[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      if (prevNextStop !== newNextStop) {
        result[tripId].prevStopId = prevNextStop;
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
  return result;
}

module.exports.processData = processData;
