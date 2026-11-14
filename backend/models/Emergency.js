import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Emergency Blood Requirement',
    },
    patientName: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    units: {
      type: Number,
      required: true,
      min: 1,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    location: {
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
    contactPhone: {
      type: String,
      required: true,
    },
    additionalNotes: {
      type: String,
      default: '',
    },
    urgencyLevel: {
      type: String,
      enum: ['Critical', 'Urgent', 'Emergency'],
      default: 'Critical',
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Expired'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Emergency = mongoose.model('Emergency', emergencySchema);
export default Emergency;
