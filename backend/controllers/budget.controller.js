const { BUDGET_RATES } = require("../utils/constant");

exports.calculate = (req, res) => {
  res.json({
    daily: BUDGET_RATES[req.body.budget],
    total: BUDGET_RATES[req.body.budget] * req.body.days,
  });
};
