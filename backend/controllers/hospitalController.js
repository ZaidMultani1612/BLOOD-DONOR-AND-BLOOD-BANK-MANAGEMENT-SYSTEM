import Hospital from '../models/Hospital.js';
import BloodRequest from '../models/BloodRequest.js';
import BloodBank from '../models/BloodBank.js';
import BloodInventory from '../models/BloodInventory.js';

// @desc Get hospital dashboard data
// @route GET /api/hospitals/dashboard
export const getHospitalDashboard = async (req, res, next) => {
  try {
    let hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) {
      hospital = await Hospital.create({
        user: req.user._id,
        name: req.user.name,
        phone: req.user.phone,
        email: req.user.email,
        address: req.user.address,
        city: req.user.city || 'Surat',
        pincode: req.user.pincode || '395009',
      });
    }

    const requests = await BloodRequest.find({ requester: req.user._id })
      .populate('bloodBank', 'name phone address')
      .sort({ createdAt: -1 });

    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
    const fulfilledRequests = requests.filter((r) => r.status === 'Fulfilled').length;

    res.status(200).json({
      success: true,
      hospital,
      stats: {
        totalRequests,
        pendingRequests,
        fulfilledRequests,
      },
      requests,
    });
  } catch (error) {
    next(error);
  }
};
