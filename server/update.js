function processData (prevData, newData) {
  const result = newData;
  Object.keys(result).forEach((tripId) => {
    // console.log(`tripId is ${tripId}`);
    if (prevData[tripId]) {
      // console.log("we are even getting here");
      const prevNextStop = prevData[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      const newNextStop = result[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      if (prevNextStop !== newNextStop) {
        // console.log("We've found one that has changed stops");
        // console.log("Trip ID is: ");
        // console.log(tripId);
        // console.log("Last stop was: ");
        // console.log(prevNextStop);
        // console.log("Next stop is: ");
        // console.log(newNextStop);
        result[tripId].prevStopId = prevNextStop;
      }
    }
  });
  return result;
}

module.exports.processData = processData;
