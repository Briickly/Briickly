import express from 'express';
import {
    adminCreateListing,
    adminDeleteListing,
    adminLogin,
    getAllListings,
    getAllUsers,
    updateApprovalSettings,
    updateListingApproval
} from '../controllers/admin.controller.js';
import { verifyAdmin, verifyAdminPasscode } from '../utils/verifyAdmin.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Admin authentication
// router.post('/login', verifyAdminPasscode, adminLogin);
router.post('/login', adminLogin);

// Protected admin routes (require both authentication and admin status)
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.get('/listings', verifyToken, verifyAdmin, getAllListings);
router.put('/listings/:id/approval', verifyToken, verifyAdmin, updateListingApproval);
router.delete('/listings/:id', verifyToken, verifyAdmin, adminDeleteListing);
router.post('/settings/approval', verifyToken, verifyAdmin, updateApprovalSettings);
router.post('/listings/create', verifyToken, verifyAdmin, adminCreateListing);

export default router;