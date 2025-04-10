const Message = require("../models/message");
const User = require("../models/User");

// 📩 Send Message
const sendMessage = async (req, res) => {
    try {
      const { receiverId, content, type } = req.body;
      const senderId = req.user.id;
  
      // Optional validation
      const allowedTypes = ["text", "image", "voice", "emoji"];
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid message type" });
      }
  
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content, // For media, pass the uploaded file URL from the frontend
        type
      });
  
      await message.save();
  
      // Remove any previous chat entry (so it appears latest in recentChats)
      await Promise.all([
        User.findByIdAndUpdate(senderId, {
          $pull: { recentChats: { user: receiverId } }
        }),
        User.findByIdAndUpdate(receiverId, {
          $pull: { recentChats: { user: senderId } }
        })
      ]);
  
      // Push updated recent chat
      await Promise.all([
        User.findByIdAndUpdate(senderId, {
          $push: {
            recentChats: {
              user: receiverId,
              lastMessage: type === "text" ? content : `[${type}]`,
              lastMessageTime: new Date(),
              unreadCount: 0
            }
          }
        }),
        User.findByIdAndUpdate(receiverId, {
          $push: {
            recentChats: {
              user: senderId,
              lastMessage: type === "text" ? content : `[${type}]`,
              lastMessageTime: new Date(),
              unreadCount: 1
            }
          }
        })
      ]);
  
      res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message", error });
    }
  };
  

// 📨 Get Chat Between Two Users
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // chatting with this user
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};

// 📬 Get Unread Count for a User
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCounts = await Message.aggregate([
      { $match: { receiver: userId, read: false } },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(unreadCounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unread count", error });
  }
};

// 📇 Get Contacts with Recent Chats
const getContacts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "recentChats.user",
        select: "name profileImageUrl online"
      });

    res.json(user.recentChats.reverse());
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts", error });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getUnreadCount,
  getContacts
};
