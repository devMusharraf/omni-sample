// createSending.js
const { sendingSchema } = require("../utils/validator");
const { getFromRedis } = require("../config/redis");
const getTemplate = require("../helpers/getTemplate");
const validatePhoneNumbers = require("../helpers/validatePhoneNumbers");
const sendMessage = require("../models/sendMessage.model");
const { randomId, ADMINID } = require("../utils/randomId");
const { sendToQueue } = require("../utils/rabbitmq");

exports.createSending = async (req, res) => {
  try {
    const { userId, parentId } = req.userInfo;
    const { error, value } = sendingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { templateId, gatewayId } = value;
    const baseMessageId = randomId();

    // fetch template & gateway
    const templateData = await getFromRedis(`${userId}:template`);
    const parentGatewayData = await getFromRedis(`${parentId}:gateway`);
    const adminId = parentGatewayData[0]?.parentId || ADMINID;

    const selectedTemplate = await getTemplate(templateData, templateId);

    // validate numbers quickly (but no DB writes here)
    const numbersInfo = await validatePhoneNumbers(value.number, value.totalNo);

    // enqueue job for worker
    const queue = await sendToQueue("processing_message", {
      jobId: baseMessageId,
      userId,
      parentId,
      adminId,
      templateId,
      gatewayId,
      campaignName: value.campaignName,
      totalNumbers: numbersInfo.length,
      numbers: numbersInfo,
      messageType: selectedTemplate.messageType,
      
    });
    console.log(queue, "queue");

    // only insert a lightweight tracking record (status = queued)

    // respond instantly
    return res.status(201).json({
      message: "Sending job queued successfully",
      jobId: baseMessageId,
      totalNumbers: numbersInfo.length,
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
