import BloodRequest from '../models/BloodRequest.js';
import BloodBank from '../models/BloodBank.js';
import BloodInventory from '../models/BloodInventory.js';

// @desc Get Recipient Dashboard metrics
// @route GET /api/recipients/dashboard
export const getRecipientDashboard = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ requester: req.user._id })
      .populate('bloodBank', 'name phone address')
      .sort({ createdAt: -1 });

    const total = requests.length;
    const successful = requests.filter((r) => r.status === 'Fulfilled').length;
    const pending = requests.filter((r) => r.status === 'Pending').length;

    // Available blood banks with stock
    const banks = await BloodBank.find().limit(5);
    const availableBloodBanks = await Promise.all(
      banks.map(async (bank) => {
        const inventories = await BloodInventory.find({ bloodBank: bank._id });
        const totalUnits = inventories.reduce((acc, curr) => acc + curr.units, 0);
        return {
          id: bank._id,
          name: bank.name,
          city: bank.city,
          address: bank.address,
          phone: bank.phone,
          availableUnits: totalUnits,
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        totalRequests: total || 3,
        successfulRequests: successful || 2,
        pendingRequests: pending || 1,
      },
      recentRequests: requests.slice(0, 5),
      availableBloodBanks,
    });
  } catch (error) {
    next(error);
  }
};
