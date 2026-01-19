const { HTTP_STATUS } = require("../utils/constant");

module.exports = (err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.statusCode || HTTP_STATUS.SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};