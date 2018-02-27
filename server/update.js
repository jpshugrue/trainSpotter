function processData (prevData, newData) {
  const result = newData;
  Object.keys(result).forEach((tripId) => {
    if (prevData[tripId] && prevData[tripId].tripUpdate) {
      const prevNextStop = prevData[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      const newNextStop = result[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      if (prevNextStop !== newNextStop) {
        result[tripId].prevStopId = prevNextStop;
      }
    }
  });
  return result;
}

module.exports.processData = processData;
