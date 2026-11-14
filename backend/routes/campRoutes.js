import express from 'express';
import {
  getDonationCamps,
  createDonationCamp,
  registerForCamp,
} from '../controllers/campController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDonationCamps);
router.post('/', protect, authorize('admin', 'bloodbank'), createDonationCamp);
router.post('/:id/register', protect, registerForCamp);

export default router;
