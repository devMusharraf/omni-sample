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

exports.createSending = async (req, res) => {
  try {
    const { userId, parentId } = req.userInfo;
    const { error, value } = sendingSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.message });

    const baseMessageId = randomId();

    const { templateId, gatewayId } = value;

    const templateData = await getFromRedis(`${userId}:template`);
    console.log(templateData, "templateData");

    const parentGatewayData = await getFromRedis(`${parentId}:gateway`);

    const adminId = parentGatewayData[0].parentId;

    const selectedTemplate = await getTemplate(templateData, templateId);

    const typeMsg = selectedTemplate.messageType;
    console.log(typeMsg, "messageType");

    const numCount = validatePhoneNumbers(value.number, value.totalNo);

    const sender = await balanceDeduct(userId, typeMsg, numCount);
    console.log(sender, "sender");
    const senderParent = await balanceDeduct(parentId, typeMsg, numCount);

    if (parentId !== adminId) {
      const superAdmin = await balanceDeduct(ADMINID, typeMsg, numCount);
      console.log(superAdmin, "superrr");
    }

    const Count = await sendMessage.create({
      senderId: userId,
      campaignName: value.campaignName,
      number: Array.isArray(value.number)
        ? value.number
        : value.number.split(","),
      templateId: value.templateId,
      gatewayId: value.gatewayId,
      numCount,
      msgId: `${baseMessageId}`,
      totalCost: sender.cost,
      status: "pending",
    });

    const numbersArray = value.number.split(",").map((num) => num.trim());

    const createdNumbers = await Promise.all(
      numbersArray.map((num, index) =>
        sendNumbers.create({
          senderId: userId,
          campaignName: value.campaignName,
          number: num,
          templateId: value.templateId,
          gatewayId: value.gatewayId,
          msgId: `${baseMessageId}:${index + 1}`,
          perMessageCost: sender.perMessageCost,
          
        })
      )
    );

    async function updateDeliveryStatus(msgId, status) {
      if (!["sent", "delivered", "failed"].include(status)) {
        throw new Error("Invalid Status");
      }

      return await sendMessage.findOneAndUpdate(
        { msgId },
        { status },
        { new: true }
      );
    }
    await updateDeliveryStatus(`${baseMessageId}:1`, "sent");

    await Transaction.create({
      userId,
      amount: sender.cost,
      type: "message sent",
      createdAt: Date.now(),
    });

    return res.status(201).json(createdNumbers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
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
