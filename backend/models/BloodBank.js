import mongoose from 'mongoose';

const bloodBankSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide blood bank name'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      default: 'Rander',
    },
    city: {
      type: String,
      default: 'Surat',
    },
    state: {
      type: String,
      default: 'Gujarat',
    },
    pincode: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number, default: 21.1702 },
      lng: { type: Number, default: 72.8311 },
    },
    operatingHours: {
      type: String,
      default: '24/7 Service',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const BloodBank = mongoose.model('BloodBank', bloodBankSchema);
export default BloodBank;
