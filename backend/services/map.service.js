const axios = require("axios");
const { GEO_URL } = require("../config/googleMaps");

exports.getCoordinates = async (place, destination) => {
  const res = await axios.get(GEO_URL, {
    params: {
      address: `${place}, ${destination}`,
      key: process.env.GOOGLE_MAPS_KEY,
    },
  });
  return res.data.results[0]?.geometry.location;
};
