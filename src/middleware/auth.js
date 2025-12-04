import jwt from 'jsonwebtoken';
import * as authService from '../services/authService.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await authService.validateToken(decoded.userId);

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token expired'
      });
    }
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};
