function convertToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
function calculateDistanceBetweenCoordinates(ltd1, lng1, ltd2, lng2) {
    const EARTH_RADIUS = 6371; // km

    ltd1 = convertToRadians(ltd1);
    lng1 = convertToRadians(lng1);

    ltd2 = convertToRadians(ltd2);
    lng2 = convertToRadians(lng2);

    const dLat = ltd2-ltd1;
    const dLon = lng2-lng1;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(ltd1) * Math.cos(ltd2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    
    return EARTH_RADIUS * c;
}

function getDistanceToBsAs(latitude, longitude, roundFactor) {
  return calculateDistanceBetweenCoordinates(ARG_COORDINATES.latitude, ARG_COORDINATES.longitude, latitude, longitude).toFixed(roundFactor)
}

export const ARG_COORDINATES = {
  latitude: -34,
  longitude: -64
}

function getDistanceMetric(countryDataStatRecord) {
  return countryDataStatRecord.coordinates.distanceToBsAs * countryDataStatRecord.requestCount
}

function calculateAverageDistance(distance, count, roundFactor) {
  return (distance / count).toFixed(roundFactor)
}

export default {calculateDistanceBetweenCoordinates, getDistanceToBsAs, getDistanceMetric, calculateAverageDistance}