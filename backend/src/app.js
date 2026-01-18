const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const error = require("../middlewares/error.middleware");

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://journyzer.vercel.app",
  process.env.FRONTEND_URL,
  process.env.CLIENT_ORIGIN,
  process.env.CORS_ORIGIN,
].filter(Boolean);

const isLocalhostOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests
      if (!origin) return callback(null, true);
      if (isLocalhostOrigin(origin)) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
    
app.get("/", (req, res) => {
  res.json({ message: "Journyzer Backend is working!" });
});

app.use("/api/auth", require("../routes/auth.routes"));
app.use("/api/user", require("../routes/user.routes"));
app.use("/api/itinerary", require("../routes/itinerary.routes"));
app.use("/api/trips", require("../routes/trip.routes"));
app.use("/api/budget", require("../routes/budget.routes"));

app.use(error);
module.exports = app;
