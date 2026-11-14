import express from 'express';
import { getRewards } from '../controllers/rewardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public leaderboard or authenticated personalized rewards
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, () => getRewards(req, res, next));
  }
  return getRewards(req, res, next);
});

export default router;
