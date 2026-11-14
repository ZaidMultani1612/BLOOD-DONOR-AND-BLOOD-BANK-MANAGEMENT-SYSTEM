import express from 'express';
import {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/', protect, authorize('admin', 'bloodbank'), addInventory);
router.put('/:id', protect, authorize('admin', 'bloodbank'), updateInventory);
router.delete('/:id', protect, authorize('admin', 'bloodbank'), deleteInventory);

export default router;
