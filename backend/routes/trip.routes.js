const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/trip.controller");

/**
 * @route   POST /api/trips
 * @desc    Save a trip
 * @access  Protected
 */
router.post("/", auth, controller.save);

/**
 * @route   GET /api/trips
 * @desc    Get all trips of logged-in user
 * @access  Protected
 */
router.get("/", auth, controller.getAll);

/**
 * @route   GET /api/trips/:id
 * @desc    Get single trip details
 * @access  Protected
 */
router.get("/:id", auth, async (req, res, next) => {
  try {
    const Trip = require("../models/Trip");
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!trip) {
      const err = new Error("Trip not found");
      err.statusCode = 404;
      throw err;
    }

    res.json(trip);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete a trip
 * @access  Protected
 */
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const Trip = require("../models/Trip");
    await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
