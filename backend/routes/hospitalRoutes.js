import express from 'express';
import { getHospitalDashboard } from '../controllers/hospitalController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin', 'hospital'), getHospitalDashboard);

export default router;
