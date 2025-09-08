const { sendingSchema } = require("../utils/validator");
const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const { setKey, getKey, getFromRedis, addToRedis } = require("../config/redis");
const Gateway = require("../models/gateway.model");
const balanceDeduct = require("../helpers/balanceDeduct");
const gatewayPrice = require("../helpers/gatewayPrice");
const getTemplate = require("../helpers/getTemplate");
const validatePhoneNumbers = require("../helpers/validatePhoneNumbers");
const sendMessage = require("../models/sendMessage.model");
const sendNumbers = require("../models/sendNumbers.model");
const { randomId } = require("../utils/randomId");
const { ADMINID } = require("../utils/randomId");

// createSending.js
exports.createSending = async (req, res) => {
  try {
    // ✅ Step 1: Extract user info & validate request body
    const { userId, parentId } = req.userInfo;
    const { error, value } = sendingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { templateId, gatewayId } = value;
    const baseMessageId = randomId();

    // ✅ Step 2: Fetch template & gateway data
    const templateData = await getFromRedis(`${userId}:template`);
    const parentGatewayData = await getFromRedis(`${parentId}:gateway`);
    const adminId = parentGatewayData[0]?.parentId || ADMINID;

    const selectedTemplate = await getTemplate(templateData, templateId);
    const typeMsg = selectedTemplate.messageType;

    // ✅ Step 3: Validate numbers and group by country
    const numbersInfo = await validatePhoneNumbers(value.number, value.totalNo);
    const groupedByCountry = numbersInfo.reduce((acc, num) => {
      const iso = num.country;
      if (!acc[iso]) acc[iso] = [];
      acc[iso].push(num.formatted);
      return acc;
    }, {});

    // ✅ Step 4: Initialize results
    const createdSendNumbers = [];
    let totalCampaignCost = 0;

    // ✅ Step 5: Process each country group
    for (const [countryIso, numbers] of Object.entries(groupedByCountry)) {
      // Deduct balance for user
      const { perMessageCost, totalCost } = await balanceDeduct(
        userId,
        typeMsg,
        countryIso,
        numbers.length
      );

      totalCampaignCost += totalCost;

      // Create sendMessage record (summary per country)
      await sendMessage.create({
        senderId: userId,
        campaignName: value.campaignName,
        number: numbers,
        templateId,
        gatewayId,
        numCount: numbers.length,
        msgId: baseMessageId,
        totalCost,
        status: "pending",
      });

      // Create sendNumbers records (detailed per number)
      const sendNumbersDocs = numbers.map((num, i) => ({
        senderId: userId,
        campaignName: value.campaignName,
        number: num,
        templateId,
        gatewayId,
        msgId: `${baseMessageId}:${countryIso}:${i + 1}`,
        perMessageCost,
        countryCode: countryIso,
      }));

      const inserted = await sendNumbers.insertMany(sendNumbersDocs);
      createdSendNumbers.push(
        ...inserted.map(doc => ({
          number: doc.number,
          perMessageCost: doc.perMessageCost,
          countryCode: doc.countryCode,
        }))
      );

      // Deduct balances for parent and admin
      await balanceDeduct(parentId, typeMsg, countryIso, numbers.length);
      if (parentId !== adminId) {
        await balanceDeduct(ADMINID, typeMsg, countryIso, numbers.length);
      }

      // Log transaction
      await Transaction.create({
        userId,
        amount: totalCost,
        type: "message sent",
        createdAt: Date.now(),
      });
    }

    // ✅ Step 6: Respond with clean JSON
    return res.status(201).json({
      message: "Sending created successfully",
      totalCampaignCost,
      createdSendNumbers,
    });
  } catch (err) {
    console.error("Error in createSending:", err);
    return res.status(500).json({ message: err.message });
  }
};

// exports.getSending = async (req, res) => {
//   try {
//     const { userId } = req.userInfo;
//     const data = await getFromRedis(`sending:${userId}`);
//     console.log(data, "data");
//     if (data) {
//       console.log("data from redis");
//       return res.status(200).json(data);
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message });
//   }
// };
