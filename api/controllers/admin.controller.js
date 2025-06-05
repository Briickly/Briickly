import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Admin login with email and passcode verification
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password, adminPasscode } = req.body;
    
    // Check if the email is the admin email
    const isAdminEmail = await User.isAdminEmail(email);
    if (!isAdminEmail) {
      return next(errorHandler(403, 'Not an admin email'));
    }

    // Verify the stored passcode
    const storedPasscode = process.env.ADMIN_PASSCODE || 'admin123';
    if (adminPasscode !== storedPasscode) {
      return next(errorHandler(403, 'Invalid admin passcode'));
    }

    // Find the user with the email
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'Admin user not found'));
    }

    // Verify password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials'));
    }

    // Set user as admin if not already
    if (!user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Return user info without password
    const { password: pass, ...rest } = user._doc;
    
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get all listings with approval status (admin only)
export const getAllListings = async (req, res, next) => {
  try {
    const { status, limit = 20, startIndex = 0 } = req.query;
    
    let query = {};
    
    // Filter by approval status if provided
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.approvalStatus = status;
    }
    
    const listings = await Listing.find(query)
      .sort({ createdAt: 'desc' })
      .skip(parseInt(startIndex))
      .limit(parseInt(limit));
      
    // Count total listings matching the query
    const total = await Listing.countDocuments(query);
    
    res.status(200).json({
      listings,
      total,
      hasMore: total > parseInt(startIndex) + parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
};

// Approve or reject a listing (admin only)
export const updateListingApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return next(errorHandler(400, 'Invalid approval status'));
    }
    
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }
    
    listing.approvalStatus = approvalStatus;
    listing.approvedBy = req.user.id;
    
    await listing.save();
    
    res.status(200).json({
      success: true,
      message: `Listing ${approvalStatus}`,
      listing
    });
  } catch (error) {
    next(error);
  }
};

// Delete any listing (admin only)
export const adminDeleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }
    
    await Listing.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Listing has been deleted by admin'
    });
  } catch (error) {
    next(error);
  }
};

// Update approval settings (admin only)
export const updateApprovalSettings = async (req, res, next) => {
  try {
    const { requireApproval } = req.body;
    
    // This would typically update a settings collection or environment variable
    // For simplicity, we'll just return a success response
    
    res.status(200).json({
      success: true,
      message: `Listing approval requirement set to: ${requireApproval}`,
      requireApproval
    });
  } catch (error) {
    next(error);
  }
};

// Create a listing as admin
export const adminCreateListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      userRef: req.user.id,
      approvalStatus: 'approved', // Auto-approve admin listings
      approvedBy: req.user.id
    };
    
    const newListing = await Listing.create(listingData);
    
    res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};