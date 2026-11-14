import express from 'express';
import {
  getEmergencies,
  createEmergency,
  resolveEmergency,
} from '../controllers/emergencyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getEmergencies);
router.post('/', protect, createEmergency);
router.put('/:id/resolve', protect, authorize('admin', 'bloodbank', 'hospital'), resolveEmergency);

export default router;
