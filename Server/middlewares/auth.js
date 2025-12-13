const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      const user = await User.findById(decoded.id).select(
        "-password -refreshToken"
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;
      next();

    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token expired",
          tokenExpired: true, // 👈 FRONTEND SIGNAL
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};



exports.isStudent = (req, res, next) => {
  try {
    // Check if user exists first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Verify accountType
    if (req.user.accountType !== "Student") {
      return res.status(403).json({ // ✅ 403 Forbidden (not 401 Unauthorized)
        success: false,
        message: "This is a protected route for Students only.",
      });
    }

    next();
  } catch (err) {
    console.error("isStudent middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Error verifying user role",
    });
  }
};

exports.isInstructor = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Instructors only.",
      });
    }

    next();
  } catch (err) {
    console.error("isInstructor middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Error verifying user role",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Admins only.",
      });
    }

    next();
  } catch (err) {
    console.error("isAdmin middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Error verifying user role",
    });
  }
};

// ============================================
// BONUS: Optional Middleware (Allow both authenticated and guest users)
// ============================================

exports.optionalAuth = async (req, res, next) => {
  try {
    let token =
      req.cookies?.accessToken ||
      req.body.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If no token, continue without user
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id || decoded._id).select("-password -refreshToken");
      req.user = user || null;
    } catch (err) {
      // Invalid token, continue as guest
      req.user = null;
    }

    next();
  } catch (err) {
    console.error("Optional auth error:", err);
    req.user = null;
    next();
  }
};

