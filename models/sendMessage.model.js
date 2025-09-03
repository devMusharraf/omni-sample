const mongoose = require("mongoose");
const { randomId } = require("../utils/randomId");

const sendMessageSchema = new mongoose.Schema({
  userId: String,
  campaignName: String,
  templateId: String,
  gatewayId: String,
  senderId: {
    type: String,
    default: () => randomId(),
  },
  number: [String],
  numCount: Number,
  msgId: String,
  totalCost: {
    type: Number,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "sent", "delivered", "failed", "status"],
    default: "pending",
  },
  scheduleTime: Date
});

module.exports = mongoose.model("sendMessage", sendMessageSchema);
