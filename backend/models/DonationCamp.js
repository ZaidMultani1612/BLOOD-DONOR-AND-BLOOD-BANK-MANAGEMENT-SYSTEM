import mongoose from 'mongoose';

const donationCampSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Camp title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
    },
    organizerName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      default: '09:00 AM',
    },
    endTime: {
      type: String,
      default: '05:00 PM',
    },
    venue: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Surat',
    },
    pincode: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    targetUnits: {
      type: Number,
      default: 100,
    },
    collectedUnits: {
      type: Number,
      default: 0,
    },
    registeredDonors: [
      {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        phone: { type: String },
        bloodGroup: { type: String },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
  },
  { timestamps: true }
);

const DonationCamp = mongoose.model('DonationCamp', donationCampSchema);
export default DonationCamp;
