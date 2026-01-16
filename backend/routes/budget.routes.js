const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/budget.controller");

/**
 * @route   POST /api/budget/calculate
 * @desc    Calculate budget for trip
 * @access  Protected
 */
router.post("/calculate", auth, controller.calculate);

module.exports = router;
