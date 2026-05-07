// ============================================================
// middlewares/auth.middleware.js — JWT Protection & Authorization
// ============================================================
// MIDDLEWARE is a function that runs BETWEEN the request arriving
// and the controller handling it. Think of it as a security
// checkpoint. If the check fails, it stops the request dead.
// If it passes, it calls next() to move to the next step.
// ============================================================

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ============================================================
// `protect` Middleware — Verifies the JWT
// ============================================================
// This answers: "Is this request coming from a LOGGED-IN user?"
//
// HOW JWT WORKS:
//   1. User logs in → server creates a signed token containing
//      a payload like: { id: 5, role: 'citizen' }
//   2. User sends this token in the Authorization header for
//      every future request: "Bearer eyJhbGciOi..."
//   3. This middleware reads that token, verifies the signature
//      using our JWT_SECRET, and decodes the payload.
//   4. It then attaches the full User object to req.user so
//      that controllers downstream know who is making the request.
// ============================================================
const protect = async (req, res, next) => {
  try {
    let token;

    // Tokens are sent in the "Authorization" header as: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // Extract just the token part
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please log in.',
      });
    }

    // jwt.verify() will throw an error if:
    //   - The token was tampered with (invalid signature)
    //   - The token has expired (based on JWT_EXPIRES_IN in .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // `decoded` now contains our payload: { id: 5, role: 'citizen', iat: ..., exp: ... }

    // Fetch the fresh user from DB to ensure the account still exists
    // We exclude the password from the result for security
    const currentUser = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user associated with this token no longer exists.',
      });
    }

    // Attach the user to the request object so controllers can use it
    // e.g., req.user.id gives us the logged-in user's ID
    req.user = currentUser;
    next(); // ✅ Token is valid — proceed to the next middleware or controller
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

// ============================================================
// `authorize` Middleware — Role-Based Access Control
// ============================================================
// This answers: "Does this logged-in user have PERMISSION to do this?"
//
// It's a "middleware factory" — a function that RETURNS a middleware.
// This lets us pass in which roles are allowed:
//   authorize('admin')          → only admins
//   authorize('admin','citizen') → both roles allowed
//
// IMPORTANT: `authorize` must always come AFTER `protect` in a route,
// because it relies on `req.user` being set by `protect` first.
// ============================================================
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Your role ('${req.user.role}') is not authorized for this action.`,
      });
    }
    next(); // ✅ User has the right role — proceed
  };
};

module.exports = { protect, authorize };