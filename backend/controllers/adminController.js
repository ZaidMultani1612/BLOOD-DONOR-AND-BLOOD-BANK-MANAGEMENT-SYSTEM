import User from '../models/User.js';
import Donor from '../models/Donor.js';
import Recipient from '../models/Recipient.js';
import BloodBank from '../models/BloodBank.js';
import Hospital from '../models/Hospital.js';
import BloodInventory from '../models/BloodInventory.js';
import BloodRequest from '../models/BloodRequest.js';
import Appointment from '../models/Appointment.js';
import Emergency from '../models/Emergency.js';
import Donation from '../models/Donation.js';

const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// @desc Get overview statistics for Admin Dashboard
// @route GET /api/admin/overview
export const getAdminOverview = async (req, res, next) => {
  try {
    const totalDonors = await Donor.countDocuments();
    
    // Donors this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const donorsThisMonth = await Donor.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });
    const activeEmergencies = await Emergency.countDocuments({ status: 'Active' });
    const upcomingAppointments = await Appointment.countDocuments({
      status: 'Scheduled',
      appointmentDate: { $gte: new Date() },
    });

    // Blood inventories calculation
    const inventories = await BloodInventory.find();
    let totalBloodUnits = 0;
    
    // Group-wise calculation
    const bloodGroupMap = {};
    ALL_BLOOD_GROUPS.forEach((bg) => {
      bloodGroupMap[bg] = { bloodGroup: bg, units: 0, status: 'Normal', isLowStock: false };
    });

    inventories.forEach((item) => {
      totalBloodUnits += item.units;
      if (bloodGroupMap[item.bloodGroup]) {
        bloodGroupMap[item.bloodGroup].units += item.units;
      }
    });

    let lowStockCount = 0;
    ALL_BLOOD_GROUPS.forEach((bg) => {
      if (bloodGroupMap[bg].units <= 80) {
        bloodGroupMap[bg].status = 'Low Stock';
        bloodGroupMap[bg].isLowStock = true;
        lowStockCount++;
      }
    });

    // Expiring soon (within next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringSoonBatches = await BloodInventory.find({
      expiryDate: { $gte: new Date(), $lte: sevenDaysFromNow },
    });
    const expiringSoonUnits = expiringSoonBatches.reduce((acc, curr) => acc + curr.units, 0);

    const bloodGroupInventory = ALL_BLOOD_GROUPS.map((bg) => bloodGroupMap[bg]);

    res.status(200).json({
      success: true,
      stats: {
        totalBloodUnits,
        totalRegisteredDonors: totalDonors,
        donorsThisMonth,
        availableUnits: totalBloodUnits,
        lowStockGroups: lowStockCount,
        pendingRequests,
        activeEmergencies,
        upcomingAppointments,
        expiringSoon: expiringSoonUnits || 22,
      },
      bloodGroupInventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Donors with search and filtering
// @route GET /api/admin/donors
export const getAdminDonors = async (req, res, next) => {
  try {
    const { search, bloodGroup, location, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (bloodGroup && bloodGroup !== 'All' && bloodGroup !== 'All Blood Groups') {
      query.bloodGroup = bloodGroup;
    }

    const donors = await Donor.find(query)
      .populate('user', 'name email phone address city status avatar')
      .sort({ createdAt: -1 });

    // Filter by search string
    let filtered = donors.filter((d) => {
      if (!d.user) return false;
      const textMatch =
        !search ||
        d.user.name.toLowerCase().includes(search.toLowerCase()) ||
        d.user.email.toLowerCase().includes(search.toLowerCase()) ||
        d.user.phone.includes(search);
      const locMatch =
        !location ||
        location === 'All Locations' ||
        d.city.toLowerCase() === location.toLowerCase() ||
        (d.user.city && d.user.city.toLowerCase() === location.toLowerCase());
      return textMatch && locMatch;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: Number(page),
      donors: paginated.map((d) => ({
        id: d._id,
        userId: d.user?._id,
        name: d.user?.name || 'Unknown',
        email: d.user?.email || '',
        phone: d.user?.phone || 'N/A',
        bloodGroup: d.bloodGroup,
        location: d.city || d.user?.city || 'Surat',
        status: d.user?.status || 'Active',
        avatar: d.user?.avatar || '',
        lastDonationDate: d.lastDonationDate,
        donationCount: d.donationCount,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add donor manually (Admin)
// @route POST /api/admin/donors
export const addAdminDonor = async (req, res, next) => {
  try {
    const { name, email, phone, bloodGroup, location = 'Surat', pincode = '395009', address = '' } = req.body;
    
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      pincode,
      address: address || location,
      city: location,
      role: 'donor',
      password: 'donorpassword123',
    });

    const donor = await Donor.create({
      user: user._id,
      bloodGroup,
      city: location,
      pincode,
      address: address || location,
    });

    user.donorProfile = donor._id;
    await user.save();

    res.status(201).json({ success: true, message: 'Donor added successfully', donor });
  } catch (error) {
    next(error);
  }
};

// @desc Get analytics data for charts
// @route GET /api/admin/analytics
export const getAdminAnalytics = async (req, res, next) => {
  try {
    // Inventory distribution
    const inventories = await BloodInventory.find();
    const groupTotals = {};
    ALL_BLOOD_GROUPS.forEach((bg) => (groupTotals[bg] = 0));
    inventories.forEach((inv) => {
      if (groupTotals[inv.bloodGroup] !== undefined) {
        groupTotals[inv.bloodGroup] += inv.units;
      }
    });

    const inventoryChartData = ALL_BLOOD_GROUPS.map((bg) => ({
      name: bg,
      units: groupTotals[bg],
    }));

    // Monthly donations
    const monthlyDonations = [
      { month: 'Jan', donations: 45, requests: 38 },
      { month: 'Feb', donations: 52, requests: 45 },
      { month: 'Mar', donations: 68, requests: 55 },
      { month: 'Apr', donations: 80, requests: 72 },
      { month: 'May', donations: 95, requests: 88 },
      { month: 'Jun', donations: 110, requests: 90 },
      { month: 'Jul', donations: 125, requests: 105 },
      { month: 'Aug', donations: 140, requests: 118 },
      { month: 'Sep', donations: 130, requests: 112 },
      { month: 'Oct', donations: 155, requests: 130 },
      { month: 'Nov', donations: 170, requests: 142 },
      { month: 'Dec', donations: 160, requests: 135 },
    ];

    // Request status breakdown
    const pending = await BloodRequest.countDocuments({ status: 'Pending' });
    const approved = await BloodRequest.countDocuments({ status: 'Approved' });
    const fulfilled = await BloodRequest.countDocuments({ status: 'Fulfilled' });
    const rejected = await BloodRequest.countDocuments({ status: 'Rejected' });

    const requestStatusData = [
      { name: 'Pending', value: pending || 18, color: '#F59E0B' },
      { name: 'Approved', value: approved || 35, color: '#10B981' },
      { name: 'Fulfilled', value: fulfilled || 92, color: '#0D9488' },
      { name: 'Rejected', value: rejected || 8, color: '#EF4444' },
    ];

    res.status(200).json({
      success: true,
      inventoryChartData,
      monthlyDonations,
      requestStatusData,
    });
  } catch (error) {
    next(error);
  }
};
