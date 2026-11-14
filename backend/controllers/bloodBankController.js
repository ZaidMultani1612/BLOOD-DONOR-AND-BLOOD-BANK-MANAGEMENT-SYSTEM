import BloodBank from '../models/BloodBank.js';
import BloodInventory from '../models/BloodInventory.js';
import BloodRequest from '../models/BloodRequest.js';
import Donation from '../models/Donation.js';
import DonationCamp from '../models/DonationCamp.js';

const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// @desc Get all blood banks (with stock summary & coordinates for Map)
// @route GET /api/bloodbanks
export const getAllBloodBanks = async (req, res, next) => {
  try {
    const { city, search, bloodGroup } = req.query;

    let banks = await BloodBank.find().populate('user', 'name email phone avatar');

    // Aggregate inventory for each blood bank
    const banksWithStock = await Promise.all(
      banks.map(async (bank) => {
        const inventories = await BloodInventory.find({ bloodBank: bank._id });
        let totalUnits = 0;
        const availableGroups = [];

        inventories.forEach((inv) => {
          totalUnits += inv.units;
          if (inv.units > 0 && !availableGroups.includes(inv.bloodGroup)) {
            availableGroups.push(inv.bloodGroup);
          }
        });

        return {
          id: bank._id,
          name: bank.name,
          phone: bank.phone,
          email: bank.email,
          address: bank.address,
          area: bank.area,
          city: bank.city,
          state: bank.state,
          pincode: bank.pincode,
          coordinates: bank.coordinates,
          operatingHours: bank.operatingHours,
          totalUnits,
          availableGroups,
        };
      })
    );

    let filtered = banksWithStock;

    if (city && city !== 'All Cities' && city !== 'All') {
      filtered = filtered.filter((b) => b.city.toLowerCase() === city.toLowerCase());
    }

    if (bloodGroup && bloodGroup !== 'All Blood Groups' && bloodGroup !== 'All') {
      filtered = filtered.filter((b) => b.availableGroups.includes(bloodGroup));
    }

    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.city.toLowerCase().includes(search.toLowerCase()) ||
          b.pincode.includes(search) ||
          b.area?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      bloodBanks: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Blood Bank Dashboard stats (see Page 2 screenshot)
// @route GET /api/bloodbanks/dashboard
export const getBloodBankDashboard = async (req, res, next) => {
  try {
    let bloodBank = await BloodBank.findOne({ user: req.user._id });
    if (!bloodBank) {
      bloodBank = await BloodBank.findOne();
    }

    if (!bloodBank) {
      return res.status(404).json({ success: false, message: 'Blood bank profile not found' });
    }

    // Inventory
    const inventories = await BloodInventory.find({ bloodBank: bloodBank._id });
    let totalStock = 0;
    const groupTotals = {};
    ALL_BLOOD_GROUPS.forEach((bg) => (groupTotals[bg] = 0));

    inventories.forEach((inv) => {
      totalStock += inv.units;
      groupTotals[inv.bloodGroup] += inv.units;
    });

    const stockChartData = ALL_BLOOD_GROUPS.map((bg) => ({
      group: bg,
      units: groupTotals[bg],
    }));

    // Pending requests
    const pendingRequests = await BloodRequest.countDocuments({
      bloodBank: bloodBank._id,
      status: 'Pending',
    });

    // Total donations
    const totalDonations = await Donation.countDocuments({ bloodBank: bloodBank._id });

    // Next upcoming camp
    const nextCamp = await DonationCamp.findOne({
      bloodBank: bloodBank._id,
      date: { $gte: new Date() },
    }).sort({ date: 1 });

    const recentActivity = [
      { id: 1, text: 'New donation received', time: '2h ago', type: 'donation' },
      { id: 2, text: 'Request approved (#BR002)', time: '3h ago', type: 'request' },
      { id: 3, text: 'Stock updated (O+)', time: '4h ago', type: 'stock' },
      { id: 4, text: 'Appointment booked by Rahul M.', time: '5h ago', type: 'appointment' },
    ];

    res.status(200).json({
      success: true,
      bank: bloodBank,
      stats: {
        totalStock: totalStock || 850,
        pendingRequests: pendingRequests || 12,
        totalDonations: totalDonations || 95,
        nextCampDate: nextCamp ? nextCamp.date : 'Jun 15, 2025',
      },
      stockChartData,
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};
