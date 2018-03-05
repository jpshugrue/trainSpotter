function processData (prevData, newData) {
  const result = newData;
  Object.keys(result).forEach((tripId) => {
    if (prevData[tripId] && prevData[tripId].tripUpdate) {
      const prevNextStop = prevData[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      const newNextStop = result[tripId].tripUpdate.stopTimeUpdate[0].stopId;
      if (prevNextStop !== newNextStop) {
        console.log(`${tripId} has a new stop (${newNextStop}), its prevStopId is ${prevNextStop}`);
        result[tripId].prevStopId = prevNextStop;
        result[tripId].sequenceTime = newData[tripId].tripUpdate.stopTimeUpdate[0].arrival.time.low;
        console.log(`Sequence time is ${result[tripId].sequenceTime}`);
      }
    } else {
      if (!prevData[tripId]) {
        console.log(`${tripId} isnt in prevData (new train)`);
      } else {
        console.log(`${tripId} doesnt have a tripUpdate in prevData`);
      }
    }
  });
  return result;
}

module.exports.processData = processData;
