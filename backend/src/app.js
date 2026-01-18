const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const error = require("../middlewares/error.middleware");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://journyzer.vercel.app"], 
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
