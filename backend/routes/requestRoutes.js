import express from 'express';
import {
  getBloodRequests,
  createBloodRequest,
  updateRequestStatus,
  getMyRequests,
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBloodRequests);
router.get('/my', protect, getMyRequests);
router.post('/', protect, createBloodRequest);
router.put('/:id/status', protect, authorize('admin', 'bloodbank', 'hospital'), updateRequestStatus);

export default router;
