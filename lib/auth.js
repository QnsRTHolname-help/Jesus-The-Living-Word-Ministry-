import jwt from "jsonwebtoken";

const COOKIE_NAME = "ministry_admin_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export function signAdminToken(admin) {
  return jwt.sign({ sub: admin._id.toString(), email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_MAX_AGE
  });
}

export function verifyToken(token) {
  try {
    if (!token || !process.env.JWT_SECRET) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_MAX_AGE
  };
}

export function getAdminFromRequest(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}
