const User = require("../models/user.model");
const { setKey, getKey, getFromRedis, addToRedis } = require("../config/redis");

async function balanceDeduct(userId, messageType, countryIso, count) {
  const gatewayDataRaw = await getFromRedis(`${userId}:gateway`);
  const gatewayData = gatewayDataRaw.map((item) => JSON.parse(item));

  if (!gatewayData || gatewayData.length === 0) {
    throw new Error(`No gateway found in Redis for user ${userId}`);
  }

  console.log(gatewayData, "gateway data");
  console.log("Looking for userId:", userId);
  console.log(
    "Available userIds:",
    gatewayData.map((g) => g.userId)
  );

  const selectedGateway = gatewayData.find((g) => g.userId === userId);
  console.log(selectedGateway, "selected one");
  console.log(selectedGateway?.price, "price object from redis");

  // ✅ find the price object for this ISO
  const countryObj = (selectedGateway.price || []).find(
    (p) => Object.keys(p)[0] === countryIso
  );

  if (!countryObj) {
    console.error("Country pricing not found:", countryIso);
    throw new Error(`Price object not found for country: ${countryIso}`);
  }

  const countryPricing = countryObj[countryIso];
  const rawPrice = countryPricing ? countryPricing[messageType] : undefined;

  if (!rawPrice) {
    throw new Error(
      `Message type "${messageType}" not found for country ${countryIso}`
    );
  }

  const perMessageCost = Number(rawPrice);
  const totalCost = perMessageCost * count;

  const updatedUser = await User.findOneAndUpdate(
    { userId },
    { $inc: { balance: -totalCost } },
    { new: true }
  );

  return {
    updatedUser,
    perMessageCost,
    totalCost,
    countryIso,
  };
}

module.exports = balanceDeduct;
