import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

// Test route to verify API is working
export const test = (req, res) => {
  res.json({
    message: 'API route is working!',
  });
};

// Update user profile
export const updateUser = async (req, res, next) => {
  // Allow only the logged-in user to update their own profile
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    const updates = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    // Hash password if provided
    if (req.body.password) {
      const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
      updates.password = hashedPassword;
    }

    // Update user and return new document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    // Exclude password from response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async(req,res,next) => {
      if(req.user.id != req.params.id) return next(errorHandler(401,'You can only delete ur account'));
      try{
          await User.findByIdAndDelete(req.params.id)
          res.clearCookie('access_token');
          res.status(200).json({success: true,message:'User is deleted'});
      }
      catch(error){
            next(error);
      }
}

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};