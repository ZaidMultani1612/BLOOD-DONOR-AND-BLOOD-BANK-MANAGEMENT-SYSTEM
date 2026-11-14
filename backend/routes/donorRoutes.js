import express from 'express';
import {
  getDonorDashboard,
  bookAppointment,
} from '../controllers/donorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getDonorDashboard);
router.post('/appointments', protect, bookAppointment);

export default router;
