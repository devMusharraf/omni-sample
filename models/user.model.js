const mongoose = require("mongoose");
const { randomId } = require("../utils/randomId");
const schema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => randomId(),
  },
 
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },

  userType: {
    type: String,
    default: "",
  },
  parentId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  mobile: {
    type: String
  },
  service: {
    type: Array,
    default: []
  },
  balance: {
    type: Number,
    default: 0,
  
  },
  balanceType: {
    type: String,
    deafult: ""
  },
  description: {
    type: String,
    deafult: ""
  },
  gatewayId: {
    type: String,
    default: ""
  }
});
class UserClass {
    static async addUser(data){
        return this.create(data)
    }

    static async existUser({username}){
        return this.findOne({username})
    }
}
schema.loadClass(UserClass);
const User = mongoose.model("User", schema);
module.exports = User;
