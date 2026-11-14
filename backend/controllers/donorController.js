import Donor from '../models/Donor.js';
import Donation from '../models/Donation.js';
import Appointment from '../models/Appointment.js';
import BloodBank from '../models/BloodBank.js';
import Reward from '../models/Reward.js';
import DonationCamp from '../models/DonationCamp.js';

// @desc Get Donor Dashboard
// @route GET /api/donors/dashboard
export const getDonorDashboard = async (req, res, next) => {
  try {
    let donor = await Donor.findOne({ user: req.user._id });
    if (!donor) {
      donor = await Donor.create({
        user: req.user._id,
        bloodGroup: 'O+',
        city: req.user.city || 'Surat',
        pincode: req.user.pincode || '395009',
      });
    }

    const donations = await Donation.find({ donor: donor._id })
      .populate('bloodBank', 'name phone address')
      .sort({ donationDate: -1 });

    const appointments = await Appointment.find({ donor: donor._id })
      .populate('bloodBank', 'name address phone')
      .sort({ appointmentDate: -1 });

    const rewards = await Reward.find({ donor: donor._id }).sort({ createdAt: -1 });

    const upcomingCamps = await DonationCamp.find({
      date: { $gte: new Date() },
      status: 'Upcoming',
    }).limit(3);

    res.status(200).json({
      success: true,
      donor,
      stats: {
        totalDonations: donor.donationCount || donations.length,
        rewardPoints: donor.rewardPoints || (donations.length * 50),
        livesSaved: (donor.donationCount || donations.length) * 3,
        nextEligibleDate: donor.lastDonationDate
          ? new Date(new Date(donor.lastDonationDate).getTime() + 90 * 24 * 60 * 60 * 1000)
          : 'Eligible Now',
      },
      donations,
      appointments,
      rewards,
      upcomingCamps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Book donation appointment
// @route POST /api/donors/appointments
export const bookAppointment = async (req, res, next) => {
  try {
    const { bloodBankId, appointmentDate, timeSlot, notes } = req.body;
    let donor = await Donor.findOne({ user: req.user._id });

    if (!donor) {
      donor = await Donor.create({
        user: req.user._id,
        bloodGroup: 'O+',
        city: req.user.city || 'Surat',
      });
    }

    const appointment = await Appointment.create({
      donor: donor._id,
      donorUser: req.user._id,
      bloodBank: bloodBankId,
      appointmentDate,
      timeSlot: timeSlot || '10:00 AM - 11:00 AM',
      bloodGroup: donor.bloodGroup,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Donation appointment scheduled successfully',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};
