import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    // Check if listings require approval (could be stored in environment variable or settings collection)
    console.log('REQUIRES_LISTING_APPROVAL env var:', process.env.REQUIRES_LISTING_APPROVAL);
    const requiresApproval = process.env.REQUIRES_LISTING_APPROVAL === 'true';
    console.log('requiresApproval value:', requiresApproval);
    
    // Create listing with appropriate approval status
    const listingData = {
      ...req.body,
      approvalStatus: requiresApproval ? 'pending' : 'approved',
      requiresApproval
    };
    
    console.log('Creating listing with approval status:', listingData.approvalStatus);
    const listing = await Listing.create(listingData);
    
    return res.status(201).json({
      ...listing._doc,
      message: requiresApproval ? 'Listing created and pending admin approval' : 'Listing created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
try {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  res.status(200).json(listing);
} catch (error) {
  next(error);
}

}

export const getListings = async(req,res,next)=>{
  try{
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if(offer === undefined || offer === 'false'){
        offer = {$in: [false,true]};
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false'){
        furnished = {$in: [false,true]};
    }

    let parking = req.query.parking;
    if(parking === undefined || parking === 'false'){
        parking = {$in: [false,true]};
    }

    let type = req.query.type;

    if(type === undefined || type === 'all'){
        type = {$in: ['sale','rent']};
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';
    
    // Only show approved listings to regular users
    // If the user is an admin (checked in the request), show all listings
    const isAdmin = req.query.isAdmin === 'true';
    console.log('isAdmin in getListings:', isAdmin);
    
    // Check if listings require approval
    const requiresApproval = process.env.REQUIRES_LISTING_APPROVAL === 'true';
    console.log('REQUIRES_LISTING_APPROVAL in getListings:', process.env.REQUIRES_LISTING_APPROVAL);
    console.log('requiresApproval value in getListings:', requiresApproval);
    
    const query = {
      name: {$regex: searchTerm, $options: 'i'},
      offer,
      furnished,
      parking,
      type,
    };
    
    // Only add approval filter for non-admin users and if approval is required
    if (!isAdmin && requiresApproval) {
      query.approvalStatus = 'approved';
      console.log('Filtering listings by approval status: approved');
    } else {
      console.log('Not filtering listings by approval status');
    }
    
    const listings = await Listing.find(query)
      .sort({[sort]: order})
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  }
  catch(error){
      next(error);
  }
}