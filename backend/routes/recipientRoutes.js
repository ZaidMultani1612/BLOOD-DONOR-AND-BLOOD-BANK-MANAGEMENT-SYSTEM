import express from 'express';
import { getRecipientDashboard } from '../controllers/recipientController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getRecipientDashboard);

export default router;
