const isHttpsRequest = (req) => {
  if (!req) return false;
  if (req.secure) return true;
  const forwardedProto = req.headers?.["x-forwarded-proto"];
  if (typeof forwardedProto === "string") {
    return forwardedProto.split(",")[0].trim() === "https";
  }
  return false;
};

const getCookieOptions = (req) => {
  // SameSite=None requires Secure=true in modern browsers.
  const secure = process.env.NODE_ENV === "production" || isHttpsRequest(req);

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
  };
};

exports.getCookieOptions = getCookieOptions;

exports.setToken = (res, token, req) => {
  res.cookie("token", token, getCookieOptions(req));
};
