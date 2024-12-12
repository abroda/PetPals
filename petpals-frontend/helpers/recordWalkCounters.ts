export const distanceInKmFromCoordinates = (
  latitude_1: number,
  longitude_1: number,
  latitude_2: number,
  longitude_2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(latitude_2 - latitude_1);
  const dLon = toRadians(longitude_2 - longitude_1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(latitude_1)) *
      Math.cos(toRadians(latitude_2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c) / 1000; // Distance in km
};

export const totalDistanceToString = (walkDistance: number) => {
  if (!walkDistance) {
    return "0.0 km";
  }

  return (
    Math.floor(walkDistance).toString() +
    "." +
    Math.floor((walkDistance % 1) * 10).toString() +
    " km"
  );
};

export const totalTimeToString = (walkTotalTime: number) => {
  if (walkTotalTime === 0 || !walkTotalTime) {
    return "00m 00s";
  }

  let diffInSeconds = walkTotalTime / 1000;
  let hrs = Math.floor(diffInSeconds / 3600);
  diffInSeconds -= hrs * 3600;
  let mins = Math.floor(diffInSeconds / 60);
  diffInSeconds -= mins * 60;
  let secs = Math.floor(diffInSeconds);

  return (
    (hrs > 0 ? hrs.toString() + "h " : "") +
    (mins > 9 ? "" : "0") +
    mins.toString() +
    "m " +
    (secs > 9 ? "" : "0") +
    secs.toString() +
    "s"
  );
};

export const caloriesBurnedToString = (
  walkDistance: number,
  walkTotalTime: number
) => {
  if (walkTotalTime === 0 || !walkTotalTime) {
    return "0.0 kcal";
  }

  let diffInSecs = walkTotalTime / 1000;
  let diffInHrs = diffInSecs / 3600;
  let avgSpeed = walkDistance / diffInHrs;

  let met =
    avgSpeed < 4
      ? 2.0 + 0.375 * avgSpeed
      : avgSpeed < 6
        ? 3.5 + (avgSpeed - 4.0)
        : avgSpeed < 12
          ? 7.0 + 0.5 * (avgSpeed - 6.0)
          : avgSpeed < 20
            ? 10 + 0.3 * (avgSpeed - 12.0)
            : 12.4 + 0.2 * (avgSpeed - 20.0);

  let weight = 70;

  let calories = met * weight * diffInHrs;

  return (
    Math.floor(calories).toString() +
    "." +
    Math.floor((calories % 1) * 10).toString() +
    " kcal"
  );
};

export const averageSpeedToString = (
  walkDistance: number,
  walkTotalTime: number
) => {
  if (walkTotalTime === 0 || !walkTotalTime) {
    return "0.0 km/h";
  }

  let diffInSecs = walkTotalTime / 1000;
  let diffInHrs = diffInSecs / 3600;

  let speed = walkDistance / diffInHrs;
  return (
    Math.floor(speed).toString() +
    "." +
    Math.floor((speed % 1) * 10).toString() +
    " km/h"
  );
};
