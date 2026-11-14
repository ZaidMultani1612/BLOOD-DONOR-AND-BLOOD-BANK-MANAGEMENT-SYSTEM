import DonationCamp from '../models/DonationCamp.js';
import BloodBank from '../models/BloodBank.js';
import Donor from '../models/Donor.js';

// @desc Get all donation camps
// @route GET /api/camps
export const getDonationCamps = async (req, res, next) => {
  try {
    const { city, status } = req.query;
    let query = {};
    if (city) query.city = city;
    if (status) query.status = status;

    const camps = await DonationCamp.find(query)
      .populate('bloodBank', 'name phone address')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      camps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create a new donation camp
// @route POST /api/camps
export const createDonationCamp = async (req, res, next) => {
  try {
    const {
      title,
      description,
      organizerName,
      date,
      startTime,
      endTime,
      venue,
      city,
      pincode,
      contactPhone,
      targetUnits,
      bloodBankId,
    } = req.body;

    let bankId = bloodBankId;
    if (!bankId) {
      const defaultBank = await BloodBank.findOne();
      bankId = defaultBank?._id;
    }

    const camp = await DonationCamp.create({
      title,
      description,
      organizerName: organizerName || req.user.name,
      bloodBank: bankId,
      date,
      startTime: startTime || '09:00 AM',
      endTime: endTime || '05:00 PM',
      venue,
      city: city || 'Surat',
      pincode: pincode || '395009',
      contactPhone: contactPhone || req.user.phone,
      targetUnits: targetUnits || 100,
    });

    res.status(201).json({
      success: true,
      message: 'Donation camp scheduled successfully',
      camp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Register donor for a camp
// @route POST /api/camps/:id/register
export const registerForCamp = async (req, res, next) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }

    const donor = await Donor.findOne({ user: req.user._id });
    const alreadyRegistered = camp.registeredDonors.some(
      (r) => r.user?.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this donation camp',
      });
    }

    camp.registeredDonors.push({
      donor: donor?._id,
      user: req.user._id,
      name: req.user.name,
      phone: req.user.phone,
      bloodGroup: donor?.bloodGroup || 'O+',
      registeredAt: new Date(),
    });

    await camp.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for this donation camp!',
      camp,
    });
  } catch (error) {
    next(error);
  }
};
