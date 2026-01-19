const axios = require("axios");
const { GEO_URL } = require("../config/googleMaps");

exports.getCoordinates = async (place, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_KEY;
  if (!apiKey) return null;

  const address = `${place}, ${destination}`.trim();
  if (!place || !destination || !address) return null;

  try {
    const res = await axios.get(GEO_URL, {
      params: {
        address,
        key: apiKey,
      },
    });

    const location = res.data?.results?.[0]?.geometry?.location;
    if (!location) return null;
    if (typeof location.lat !== "number" || typeof location.lng !== "number") return null;
    return location;
  } catch {
    return null;
  }
};