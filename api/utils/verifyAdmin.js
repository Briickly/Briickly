import User from '../models/user.model.js';
import { errorHandler } from './error.js';

// Middleware to verify if the user is an admin
export const verifyAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.user) {
      return next(errorHandler(401, 'Unauthorized - Authentication required'));
    }

    // Find the user in the database
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return next(errorHandler(403, 'Forbidden - Admin access required'));
    }

    // User is an admin, proceed to the next middleware
    next();
  } catch (error) {
    next(errorHandler(500, 'Error verifying admin status'));
  }
};

// Middleware to verify admin passcode
export const verifyAdminPasscode = async (req, res, next) => {
  try {
    const { passcode } = req.body;
    const storedPasscode = process.env.ADMIN_PASSCODE || 'admin123'; // Default fallback passcode

    if (passcode !== storedPasscode) {
      return next(errorHandler(403, 'Invalid admin passcode'));
    }

    next();
  } catch (error) {
    next(errorHandler(500, 'Error verifying admin passcode'));
  }
};