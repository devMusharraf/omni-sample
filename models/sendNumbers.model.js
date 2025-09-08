const mongoose = require("mongoose");
const { randomId } = require("../utils/randomId");
const sendNumbersSchema = new mongoose.Schema({
  userId: String,
  campaignName: String,
  templateId: String,
  gatewayId: String,
  senderId: {
    type: String,
    default: () => randomId(),
  },
  number: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["sent, delievered", "failed"],
  },
  senderId: {
    type: String,
    default: () => randomId(),
  },
  msgId: String,
  perMessageCost: {
    type: Number,
    default: "",
  },
  countryCode: {
    type: String,
    default:""
  }
  
});

module.exports = mongoose.model("sendNumbers", sendNumbersSchema);
