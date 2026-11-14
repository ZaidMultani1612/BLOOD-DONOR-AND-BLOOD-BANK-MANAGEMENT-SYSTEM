import express from 'express';
import {
  getAdminOverview,
  getAdminDonors,
  addAdminDonor,
  getAdminAnalytics,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Allow admin access
router.get('/overview', protect, authorize('admin'), getAdminOverview);
router.get('/donors', protect, authorize('admin'), getAdminDonors);
router.post('/donors', protect, authorize('admin'), addAdminDonor);
router.get('/analytics', protect, authorize('admin'), getAdminAnalytics);

export default router;
