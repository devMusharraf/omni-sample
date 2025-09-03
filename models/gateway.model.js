const mongoose = require("mongoose");
const { randomId } = require("../utils/randomId");

const gatewaySchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "",
  },
  gatewayName: String,
  gatewayId: {
    type: String,
    default: () => randomId(),
  },
  price: {
    type: Array,
    default : [,
       { textArea: 0,
        text_variable: 0}
    ]
  },
  parentId: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  service: {
    type: Array,
    default: []
  },
  country: String

});

const Gateway = mongoose.model("Gateway", gatewaySchema);
module.exports = Gateway