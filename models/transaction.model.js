const { randomId } = require("../utils/randomId");
const mongoose = require("mongoose")
const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, default: () => randomId() },
  userId: String,
  amount: {
    type: Number,
    default: ""
  },
  type: { type: String, enum: ["message sent", "manual_credit", "refund"] },
  relatedId: {
    type: String,
    default: ""
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
