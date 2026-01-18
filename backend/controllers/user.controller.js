const admin = require("../config/firebase");
const Trip = require("../models/Trip");
const User = require("../models/User");

const getOrCreateUser = async (firebaseUser) => {
  const uid = firebaseUser.uid;

  const tokenEmail = firebaseUser.email;
  const tokenName = firebaseUser.name;
  const tokenPicture = firebaseUser.picture;
  const tokenProvider = Array.isArray(firebaseUser.firebase?.sign_in_provider)
    ? firebaseUser.firebase.sign_in_provider
    : firebaseUser.firebase?.sign_in_provider;

  let user = await User.findOne({ uid });
  if (!user) {
    user = await User.create({
      uid,
      email: tokenEmail,
      name: tokenName,
      provider: tokenProvider,
      displayName: tokenName,
      photoURL: tokenPicture,
    });
    return user;
  }

  // Keep basic info fresh.
  const patch = {};
  if (tokenEmail && !user.email) patch.email = tokenEmail;
  if (tokenName && !user.name) patch.name = tokenName;
  if (tokenName && !user.displayName) patch.displayName = tokenName;
  if (tokenPicture && !user.photoURL) patch.photoURL = tokenPicture;
  if (tokenProvider && !user.provider) patch.provider = tokenProvider;

  if (Object.keys(patch).length > 0) {
    user = await User.findOneAndUpdate({ uid }, { $set: patch }, { new: true });
  }

  return user;
};

exports.getProfile = async (req, res, next) => {
  try {
    const userDoc = await getOrCreateUser(req.user);

    const trips = await Trip.find({ userId: req.user.uid });
    const totalTrips = trips.length;
    const totalDays = trips.reduce(
      (sum, t) => sum + (Number(t.days) > 0 ? Number(t.days) : 0),
      0
    );

    const destinations = trips
      .map((t) => String(t.destination || "").trim())
      .filter(Boolean);
    const distinctDestinations = new Set(destinations);

    res.json({
      _id: userDoc._id,
      email: userDoc.email || req.user.email || "",
      displayName: userDoc.displayName || userDoc.name || req.user.name || "",
      photoURL: userDoc.photoURL || req.user.picture || "",
      bio: userDoc.bio || "",
      location: userDoc.location || "",
      interests: Array.isArray(userDoc.interests) ? userDoc.interests : [],
      createdAt: userDoc.createdAt,
      stats: {
        totalTrips,
        totalDays,
        countriesVisited: distinctDestinations.size,
        citiesVisited: distinctDestinations.size,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await getOrCreateUser(req.user);

    const displayName = String(req.body?.displayName ?? "");
    const bio = String(req.body?.bio ?? "");
    const location = String(req.body?.location ?? "");

    const userDoc = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $set: {
          displayName,
          bio,
          location,
        },
      },
      { new: true }
    );

    if (!userDoc) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    // Return the same shape as getProfile (including stats).
    req.user.name = req.user.name || userDoc.name;
    req.user.email = req.user.email || userDoc.email;
    req.user.picture = req.user.picture || userDoc.photoURL;

    // Reuse getProfile logic quickly.
    const trips = await Trip.find({ userId: req.user.uid });
    const totalTrips = trips.length;
    const totalDays = trips.reduce(
      (sum, t) => sum + (Number(t.days) > 0 ? Number(t.days) : 0),
      0
    );
    const destinations = trips
      .map((t) => String(t.destination || "").trim())
      .filter(Boolean);
    const distinctDestinations = new Set(destinations);

    res.json({
      _id: userDoc._id,
      email: userDoc.email || req.user.email || "",
      displayName: userDoc.displayName || userDoc.name || req.user.name || "",
      photoURL: userDoc.photoURL || req.user.picture || "",
      bio: userDoc.bio || "",
      location: userDoc.location || "",
      interests: Array.isArray(userDoc.interests) ? userDoc.interests : [],
      createdAt: userDoc.createdAt,
      stats: {
        totalTrips,
        totalDays,
        countriesVisited: distinctDestinations.size,
        citiesVisited: distinctDestinations.size,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    const userDoc = await getOrCreateUser(req.user);
    res.json(userDoc.settings || {});
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    await getOrCreateUser(req.user);

    const settings = req.body;
    const userDoc = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $set: { settings } },
      { new: true }
    );

    if (!userDoc) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    res.json(userDoc.settings || {});
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const newPassword = String(req.body?.newPassword ?? "");
    if (!newPassword || newPassword.length < 6) {
      const err = new Error("Password must be at least 6 characters");
      err.statusCode = 400;
      throw err;
    }

    await admin.auth().updateUser(req.user.uid, { password: newPassword });
    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    // Best effort cleanup.
    await Promise.all([
      admin.auth().deleteUser(uid),
      User.deleteOne({ uid }),
      Trip.deleteMany({ userId: uid }),
    ]);

    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};
