import express from 'express';
import {
  getAllBloodBanks,
  getBloodBankDashboard,
} from '../controllers/bloodBankController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBloodBanks);
router.get('/dashboard', protect, authorize('admin', 'bloodbank'), getBloodBankDashboard);

export default router;
