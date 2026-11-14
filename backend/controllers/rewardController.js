import Reward from '../models/Reward.js';
import Donor from '../models/Donor.js';
import Donation from '../models/Donation.js';

// @desc Get rewards, milestones, and leaderboard
// @route GET /api/rewards
export const getRewards = async (req, res, next) => {
  try {
    // Leaderboard sorted by donation count or reward points
    const topDonors = await Donor.find()
      .populate('user', 'name city avatar')
      .sort({ rewardPoints: -1, donationCount: -1 })
      .limit(10);

    const leaderboard = topDonors.map((d, index) => ({
      rank: index + 1,
      id: d._id,
      name: d.user?.name || 'Anonymous Donor',
      city: d.city,
      bloodGroup: d.bloodGroup,
      donationCount: d.donationCount,
      rewardPoints: d.rewardPoints,
      avatar: d.user?.avatar,
      badge:
        d.rewardPoints >= 500
          ? 'Life Guardian'
          : d.rewardPoints >= 300
          ? 'Platinum Champion'
          : d.rewardPoints >= 150
          ? 'Gold Savior'
          : 'Silver Hero',
    }));

    // If logged in donor, get their specific rewards
    let myRewards = [];
    let myStats = null;
    if (req.user) {
      const donor = await Donor.findOne({ user: req.user._id });
      if (donor) {
        myRewards = await Reward.find({ donor: donor._id });
        myStats = {
          points: donor.rewardPoints,
          donationCount: donor.donationCount,
          bloodGroup: donor.bloodGroup,
        };
      }
    }

    const availableBadges = [
      { name: 'Bronze Donor', threshold: 1, points: 50, desc: 'Made first verified blood donation' },
      { name: 'Silver Hero', threshold: 3, points: 150, desc: 'Completed 3 lifesaving donations' },
      { name: 'Gold Savior', threshold: 5, points: 250, desc: 'Completed 5 donations and saved 15 lives' },
      { name: 'Platinum Champion', threshold: 10, points: 500, desc: 'Legendary donor with 10 donations' },
      { name: 'Life Guardian', threshold: 20, points: 1000, desc: 'Lifetime honor for community service' },
    ];

    res.status(200).json({
      success: true,
      leaderboard,
      myRewards,
      myStats,
      availableBadges,
    });
  } catch (error) {
    next(error);
  }
};
