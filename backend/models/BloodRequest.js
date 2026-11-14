import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      default: () => '#BR' + Math.floor(1000 + Math.random() * 9000),
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requesterRole: {
      type: String,
      enum: ['recipient', 'hospital', 'donor', 'admin'],
      default: 'recipient',
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    units: {
      type: Number,
      required: true,
      min: [1, 'At least 1 unit is required'],
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Processing', 'Fulfilled', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    hospitalName: {
      type: String,
      default: '',
    },
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
    },
    contactPhone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Surat',
    },
    pincode: {
      type: String,
      default: '395009',
    },
    notes: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
export default BloodRequest;
