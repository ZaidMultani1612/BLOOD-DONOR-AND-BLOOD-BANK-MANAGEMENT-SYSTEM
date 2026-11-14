import mongoose from 'mongoose';

const recipientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    city: {
      type: String,
      default: 'Surat',
    },
    pincode: {
      type: String,
      default: '395009',
    },
    emergencyContact: {
      type: String,
    },
  },
  { timestamps: true }
);

const Recipient = mongoose.model('Recipient', recipientSchema);
export default Recipient;
