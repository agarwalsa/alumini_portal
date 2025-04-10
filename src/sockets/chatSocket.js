const Message = require("../models/message");
const User = require("../models/User");

const connectedUsers = new Map(); // userId -> socket.id

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // ✅ User joins socket
    socket.on("join", async (userId) => {
      connectedUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { online: true });
      console.log(`${userId} joined socket`);
    });

    // ✉️ Send message
    socket.on("sendMessage", async ({ sender, receiver, content, type, mediaUrl }) => {
      const newMessage = new Message({
        sender,
        receiver,
        content,
        messageType: type,
        mediaUrl
      });
      await newMessage.save();

      // ✅ Emit to receiver if online
      const receiverSocket = connectedUsers.get(receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit("newMessage", newMessage);
      }

      // ✅ Update recent chats for sender and receiver
      const updateRecentChat = async (userId, otherUserId, msg) => {
        await User.findByIdAndUpdate(userId, {
          $pull: { recentChats: { user: otherUserId } }
        });
        await User.findByIdAndUpdate(userId, {
          $push: {
            recentChats: {
              user: otherUserId,
              lastMessage: msg.content,
              lastMessageTime: msg.createdAt,
              $inc: { unreadCount: 1 }
            }
          }
        });
      };

      await updateRecentChat(sender, receiver, newMessage);
      await updateRecentChat(receiver, sender, newMessage);
    });

    // ✅ User disconnects
    socket.on("disconnect", async () => {
      const userId = [...connectedUsers].find(([_, id]) => id === socket.id)?.[0];
      if (userId) {
        connectedUsers.delete(userId);
        await User.findByIdAndUpdate(userId, { online: false });
      }
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;
