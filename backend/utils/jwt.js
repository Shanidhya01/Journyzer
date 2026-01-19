const isProd = process.env.NODE_ENV === "production";

const getCookieOptions = (req) => {
  // In local development (http://localhost) a `secure: true` cookie will NOT be set/sent.
  // In production (https) we must use SameSite=None + Secure for cross-site cookies.
  const secure = isProd;
  const sameSite = isProd ? "none" : "lax";

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  };
};

exports.getCookieOptions = getCookieOptions;

exports.setToken = (res, token, req) => {
  res.cookie("token", token, getCookieOptions(req));
};