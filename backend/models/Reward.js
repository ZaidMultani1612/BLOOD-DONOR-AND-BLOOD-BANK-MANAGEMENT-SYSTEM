import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    badgeType: {
      type: String,
      enum: ['Bronze Donor', 'Silver Hero', 'Gold Savior', 'Platinum Champion', 'Life Guardian'],
      default: 'Bronze Donor',
    },
    points: {
      type: Number,
      default: 50,
    },
    description: {
      type: String,
      default: '',
    },
    iconName: {
      type: String,
      default: 'Award',
    },
  },
  { timestamps: true }
);

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
