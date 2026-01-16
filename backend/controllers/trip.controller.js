const Trip = require("../models/Trip");

exports.save = async (req, res) => {
  res.json(await Trip.create({ userId: req.user.uid, ...req.body }));
};

exports.getAll = async (req, res) => {
  res.json(await Trip.find({ userId: req.user.uid }));
};
