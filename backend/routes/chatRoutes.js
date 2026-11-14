import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:partnerId', protect, getMessages);
router.post('/send', protect, sendMessage);

export default router;
