import BloodInventory from '../models/BloodInventory.js';
import BloodBank from '../models/BloodBank.js';

// @desc Get all blood inventory items
// @route GET /api/inventory
export const getInventory = async (req, res, next) => {
  try {
    const { search, status, bloodBankId, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status && status !== 'All' && status !== 'All Status') {
      query.status = status;
    }
    if (bloodBankId) {
      query.bloodBank = bloodBankId;
    }

    let items = await BloodInventory.find(query)
      .populate('bloodBank', 'name city area pincode')
      .sort({ createdAt: -1 });

    if (search) {
      items = items.filter(
        (item) =>
          item.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
          item.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
          item.bloodBank?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: Number(page),
      inventory: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add new blood inventory
// @route POST /api/inventory
export const addInventory = async (req, res, next) => {
  try {
    const { bloodGroup, units, expiryDate, bloodBankId, notes } = req.body;

    let bankId = bloodBankId;
    if (!bankId) {
      const firstBank = await BloodBank.findOne();
      bankId = firstBank?._id;
    }

    if (!bankId) {
      return res.status(400).json({
        success: false,
        message: 'No blood bank found. Please create a blood bank first.',
      });
    }

    const item = await BloodInventory.create({
      bloodBank: bankId,
      bloodGroup,
      units: Number(units),
      expiryDate: expiryDate || new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days shelf life
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Blood stock added successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update inventory
// @route PUT /api/inventory/:id
export const updateInventory = async (req, res, next) => {
  try {
    const { units, status, expiryDate } = req.body;
    const item = await BloodInventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Stock item not found' });
    }

    if (units !== undefined) item.units = Number(units);
    if (status) item.status = status;
    if (expiryDate) item.expiryDate = expiryDate;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Blood inventory updated successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete inventory item
// @route DELETE /api/inventory/:id
export const deleteInventory = async (req, res, next) => {
  try {
    const item = await BloodInventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Stock item not found' });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: 'Stock record removed' });
  } catch (error) {
    next(error);
  }
};
