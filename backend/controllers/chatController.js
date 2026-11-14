import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Helper to create consistent conversation ID
const getConversationId = (id1, id2) => {
  return [id1.toString(), id2.toString()].sort().join('_');
};

// @desc Get conversations for logged in user
// @route GET /api/chats/conversations
export const getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Find all users with hospital or bloodbank roles or admin
    const chatPartners = await User.find({
      _id: { $ne: currentUserId },
      role: { $in: ['bloodbank', 'hospital', 'admin'] },
    }).select('name email role');

    // For each partner, get latest message
    const conversations = await Promise.all(
      chatPartners.map(async (partner) => {
        const convId = getConversationId(currentUserId, partner._id);
        const lastMessage = await Chat.findOne({ conversationId: convId })
          .sort({ createdAt: -1 });

        const unreadCount = await Chat.countDocuments({
          conversationId: convId,
          recipient: currentUserId,
          read: false,
        });

        return {
          partnerId: partner._id,
          name: partner.name,
          role: partner.role,
          lastMessage: lastMessage ? lastMessage.message : 'No messages yet',
          timestamp: lastMessage ? lastMessage.createdAt : partner.createdAt,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get message history with a specific partner
// @route GET /api/chats/:partnerId
export const getMessages = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const convId = getConversationId(req.user._id, partnerId);

    // Mark incoming messages as read
    await Chat.updateMany(
      { conversationId: convId, recipient: req.user._id, read: false },
      { read: true }
    );

    const messages = await Chat.find({ conversationId: convId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Send a chat message
// @route POST /api/chats/send
export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, message } = req.body;
    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    const convId = getConversationId(req.user._id, recipient._id);

    const chatMsg = await Chat.create({
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      recipient: recipient._id,
      recipientName: recipient.name,
      recipientRole: recipient.role,
      message,
      conversationId: convId,
    });

    res.status(201).json({
      success: true,
      message: chatMsg,
    });
  } catch (error) {
    next(error);
  }
};
