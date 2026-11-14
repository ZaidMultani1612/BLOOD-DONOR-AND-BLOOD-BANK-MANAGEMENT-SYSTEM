import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Please provide a pincode'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: 'Surat',
    },
    state: {
      type: String,
      trim: true,
      default: 'Gujarat',
    },
    role: {
      type: String,
      enum: ['admin', 'donor', 'recipient', 'bloodbank', 'hospital'],
      default: 'donor',
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    // Optional reference ids for specific profiles
    bloodBankProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
    },
    donorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
    },
    hospitalProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    recipientProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipient',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
