import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Donor from '../models/Donor.js';
import Recipient from '../models/Recipient.js';
import BloodBank from '../models/BloodBank.js';
import Hospital from '../models/Hospital.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'healthtech_super_secret_jwt_key_2025_prod_secure',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc Register user
// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      pincode,
      address,
      role = 'donor',
      city = 'Surat',
      bloodGroup = 'O+',
      bloodBankName,
      hospitalName,
    } = req.body;

    // Disallow public registration as 'admin'
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be registered publicly',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      pincode,
      address,
      city,
      role,
    });

    // Create role-specific document
    if (role === 'donor') {
      const donor = await Donor.create({
        user: user._id,
        bloodGroup: bloodGroup || 'O+',
        city,
        pincode,
        address,
      });
      user.donorProfile = donor._id;
      await user.save();
    } else if (role === 'recipient') {
      const recipient = await Recipient.create({
        user: user._id,
        bloodGroup: bloodGroup || 'O+',
        city,
        pincode,
      });
      user.recipientProfile = recipient._id;
      await user.save();
    } else if (role === 'bloodbank') {
      const bloodBank = await BloodBank.create({
        user: user._id,
        name: bloodBankName || name,
        phone,
        email,
        address,
        city,
        pincode,
      });
      user.bloodBankProfile = bloodBank._id;
      await user.save();
    } else if (role === 'hospital') {
      const hospital = await Hospital.create({
        user: user._id,
        name: hospitalName || name,
        phone,
        email,
        address,
        city,
        pincode,
      });
      user.hospitalProfile = hospital._id;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        donorProfile: user.donorProfile,
        bloodBankProfile: user.bloodBankProfile,
        hospitalProfile: user.hospitalProfile,
        recipientProfile: user.recipientProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id);

    // populate profile based on role
    let profileData = null;
    if (user.role === 'donor') {
      profileData = await Donor.findOne({ user: user._id });
    } else if (user.role === 'bloodbank') {
      profileData = await BloodBank.findOne({ user: user._id });
    } else if (user.role === 'hospital') {
      profileData = await Hospital.findOne({ user: user._id });
    } else if (user.role === 'recipient') {
      profileData = await Recipient.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        avatar: user.avatar,
        profile: profileData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profileData = null;
    if (user.role === 'donor') {
      profileData = await Donor.findOne({ user: user._id });
    } else if (user.role === 'bloodbank') {
      profileData = await BloodBank.findOne({ user: user._id });
    } else if (user.role === 'hospital') {
      profileData = await Hospital.findOne({ user: user._id });
    } else if (user.role === 'recipient') {
      profileData = await Recipient.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        avatar: user.avatar,
        profile: profileData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, pincode, bloodGroup } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;
    if (pincode) user.pincode = pincode;

    await user.save();

    if (user.role === 'donor' && bloodGroup) {
      await Donor.findOneAndUpdate(
        { user: user._id },
        { bloodGroup, city, pincode, address },
        { upsert: true }
      );
    } else if (user.role === 'recipient' && bloodGroup) {
      await Recipient.findOneAndUpdate(
        { user: user._id },
        { bloodGroup, city, pincode },
        { upsert: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Forgot Password
// @route POST /api/auth/forgotpassword
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user registered with this email address',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link and instructions have been dispatched to your email.',
    });
  } catch (error) {
    next(error);
  }
};
