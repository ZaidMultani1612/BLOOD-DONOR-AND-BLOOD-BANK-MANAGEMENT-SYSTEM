import mongoose from 'mongoose';

const bloodInventorySchema = new mongoose.Schema(
  {
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
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
      min: [0, 'Units cannot be negative'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['Normal', 'Low Stock', 'Critical'],
      default: 'Normal',
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    collectionDate: {
      type: Date,
      default: Date.now,
    },
    batchNumber: {
      type: String,
      default: () => 'BATCH-' + Math.floor(100000 + Math.random() * 900000),
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-calculate status based on units
bloodInventorySchema.pre('save', function (next) {
  if (this.units <= 10) {
    this.status = 'Critical';
  } else if (this.units <= 40) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Normal';
  }
  next();
});

const BloodInventory = mongoose.model('BloodInventory', bloodInventorySchema);
export default BloodInventory;
