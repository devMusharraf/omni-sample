const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "",
  },
  country: String,
  date: Date,
  messageSent: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
statsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Stats", statsSchema);
