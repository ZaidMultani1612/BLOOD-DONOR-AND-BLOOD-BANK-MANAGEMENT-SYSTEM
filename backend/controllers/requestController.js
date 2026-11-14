import BloodRequest from '../models/BloodRequest.js';
import BloodInventory from '../models/BloodInventory.js';
import BloodBank from '../models/BloodBank.js';

// @desc Get all blood requests
// @route GET /api/requests
export const getBloodRequests = async (req, res, next) => {
  try {
    const { status, bloodGroup, search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status && status !== 'All' && status !== 'All Status') {
      query.status = status;
    }
    if (bloodGroup && bloodGroup !== 'All' && bloodGroup !== 'All Blood Groups') {
      query.bloodGroup = bloodGroup;
    }

    let requests = await BloodRequest.find(query)
      .populate('requester', 'name email phone')
      .populate('bloodBank', 'name phone address')
      .sort({ createdAt: -1 });

    if (search) {
      requests = requests.filter(
        (r) =>
          r.patientName.toLowerCase().includes(search.toLowerCase()) ||
          r.requestId.toLowerCase().includes(search.toLowerCase()) ||
          r.hospitalName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = requests.length;
    const startIndex = (page - 1) * limit;
    const paginated = requests.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: Number(page),
      requests: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create new blood request
// @route POST /api/requests
export const createBloodRequest = async (req, res, next) => {
  try {
    const {
      patientName,
      bloodGroup,
      units,
      urgency = 'Medium',
      hospitalName,
      contactPhone,
      city,
      pincode,
      notes,
      bloodBankId,
    } = req.body;

    let targetBankId = bloodBankId;
    if (!targetBankId) {
      const defaultBank = await BloodBank.findOne();
      targetBankId = defaultBank?._id;
    }

    const newRequest = await BloodRequest.create({
      requester: req.user._id,
      requesterRole: req.user.role,
      patientName,
      bloodGroup,
      units: Number(units),
      urgency,
      hospitalName: hospitalName || 'General Hospital',
      bloodBank: targetBankId,
      contactPhone: contactPhone || req.user.phone,
      city: city || req.user.city || 'Surat',
      pincode: pincode || req.user.pincode || '395009',
      notes,
      statusHistory: [
        {
          status: 'Pending',
          changedAt: new Date(),
          changedBy: req.user._id,
          note: 'Request initialized',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Blood request submitted successfully',
      request: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update request status
// @route PUT /api/requests/:id/status
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // If status is being marked as Fulfilled, deduct units from inventory
    if (status === 'Fulfilled' && request.status !== 'Fulfilled') {
      const inventory = await BloodInventory.findOne({
        bloodGroup: request.bloodGroup,
        units: { $gte: request.units },
      });

      if (inventory) {
        inventory.units -= request.units;
        await inventory.save();
      }
    }

    request.status = status;
    request.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user?._id,
      note: note || `Status updated to ${status}`,
    });

    await request.save();

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user's submitted requests
// @route GET /api/requests/my
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ requester: req.user._id })
      .populate('bloodBank', 'name phone address')
      .sort({ createdAt: -1 });

    const total = requests.length;
    const successful = requests.filter((r) => r.status === 'Fulfilled').length;
    const pending = requests.filter((r) => r.status === 'Pending').length;

    res.status(200).json({
      success: true,
      stats: { total, successful, pending },
      requests,
    });
  } catch (error) {
    next(error);
  }
};
