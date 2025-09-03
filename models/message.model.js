const mongoose = require("mongoose");
const { randomId } = require("../utils/randomId");

const messageSchema = new mongoose.Schema({
  msgId: { type: String, unique: true, default: () => randomId() },
  channel: {
    type: String,
    enum: ["WhatsApp", "SMS", "RCS"],
  },
  recipient: String,
  content: String, 
  status: {
    type: String,
    enum: ["pending", "sent", "delivered", "failed"],
    default: "pending",
  },
  userId: String, 
  parentId: String, 
  superAdminId: String, 
 
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Message", messageSchema);