const User = require("../models/user.model");
const { setKey, getKey, getFromRedis, addToRedis } = require("../config/redis");

async function balanceDeduct(userId, messageType, numCount) {
  const gatewayData = await getFromRedis(`${userId}:gateway`);
   const selectedGateway = gatewayData.find((g) => g.userId === userId);
   
    if (!selectedGateway) throw new Error("Template not found");
   
  const rawPrice = selectedGateway?.price?.[0]?.[messageType];
  if (rawPrice == null) {
    throw new Error(`Price not found for messageType: ${messageType}`);
  }

const perMessageCost = Number(rawPrice);
const cost = perMessageCost * numCount
  const updatedUser = await User.findOneAndUpdate(
    { userId },
    { $inc: { balance: -cost } },
    { new: true }
  );


  
  

  return {updatedUser, perMessageCost, cost};
}
module.exports = balanceDeduct;
