const mongoose = require("mongoose");
const { randomId } = require("../utils/randomId");

const gatewaySchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "",
  },
  userType: String,
  gatewayName: String,
  gatewayId: {
    type: String,
    default: () => randomId(),
  },
  price: {
    type: Array,
    default: [
      {
        country: {
          textArea: { type: Number, default: 0 },
          text_variable: { type: Number, default: 0 },
        },
      },
    ],
  },

  parentId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  service: {
    type: Array,
    default: [],
  },

});

const Gateway = mongoose.model("Gateway", gatewaySchema);
module.exports = Gateway;
