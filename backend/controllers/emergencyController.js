import Emergency from '../models/Emergency.js';

// @desc Get active emergencies
// @route GET /api/emergencies
export const getEmergencies = async (req, res, next) => {
  try {
    const { status = 'Active', bloodGroup } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (bloodGroup && bloodGroup !== 'All') {
      query.bloodGroup = bloodGroup;
    }

    const emergencies = await Emergency.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: emergencies.length,
      emergencies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create emergency SOS
// @route POST /api/emergencies
export const createEmergency = async (req, res, next) => {
  try {
    const {
      patientName,
      bloodGroup,
      units,
      hospitalName,
      location,
      city,
      pincode,
      contactPhone,
      additionalNotes,
      urgencyLevel = 'Critical',
    } = req.body;

    const emergency = await Emergency.create({
      patientName,
      bloodGroup,
      units: Number(units),
      hospitalName,
      location,
      city: city || 'Surat',
      pincode: pincode || '395009',
      contactPhone,
      additionalNotes,
      urgencyLevel,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Emergency SOS Broadcasted Successfully!',
      emergency,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Resolve emergency
// @route PUT /api/emergencies/:id/resolve
export const resolveEmergency = async (req, res, next) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    emergency.status = 'Resolved';
    emergency.resolvedAt = new Date();
    await emergency.save();

    res.status(200).json({
      success: true,
      message: 'Emergency SOS marked as resolved',
      emergency,
    });
  } catch (error) {
    next(error);
  }
};
