import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Please specify a blood group'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    dateOfBirth: {
      type: Date,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    city: {
      type: String,
      default: 'Surat',
    },
    pincode: {
      type: String,
      default: '395009',
    },
    address: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Donor = mongoose.model('Donor', donorSchema);
export default Donor;
