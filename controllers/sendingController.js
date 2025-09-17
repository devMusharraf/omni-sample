// createSending.js
const { sendingSchema } = require("../utils/validator");
const { getFromRedis } = require("../config/redis");
const getTemplate = require("../helpers/getTemplate");
const validatePhoneNumbers = require("../helpers/validatePhoneNumbers");
const { randomId, ADMINID } = require("../utils/randomId");
const { sendToQueue } = require("../utils/rabbitmq");
const fs = require("fs");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const multer = require("multer");

// ================== CREATE SENDING ==================
exports.createSending = async (req, res) => {
  try {
    const { userId, parentId } = req.userInfo;
    let numbersString = "";

    if (req.file) {
      const mobileNumberHeader = req.body.mobileNumberHeader;
      const numbers = [];

      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on("data", (row) => {
            if (row[mobileNumberHeader]) {
              numbers.push(row[mobileNumberHeader].trim());
            }
          })
          .on("end", resolve)
          .on("error", reject);
      });

      if (numbers.length === 0) {
        return res
          .status(400)
          .json({ message: "CSV file contains no numbers" });
      }

      numbersString = numbers.join(","); // ✅ single string
      req.body.totalNo = numbers.length;
    }

    // validate request body schema
    const { error, value } = sendingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    let { variables } = req.body;
    if (typeof variables === "string") {
      try {
        variables = JSON.parse(variables); // support form-data stringified JSON
      } catch {
        return res
          .status(400)
          .json({ message: "variables must be valid JSON" });
      }
    }

    const { templateId, gatewayId } = value;
    const baseMessageId = randomId();

    // fetch template & gateway
    const templateData = await getFromRedis(`${userId}:template`);
    const parentGatewayData = await getFromRedis(`${parentId}:gateway`);
    const adminId = parentGatewayData[0]?.parentId || ADMINID;

    const selectedTemplate = await getTemplate(templateData, templateId);

    // merge variables into template text
    if (variables) {
      let finalMessage = selectedTemplate.textArea.replace(
        /\{\{(\w+)\}\}/g,
        (match, name) => {
          return variables?.[name] !== undefined ? variables[name] : match;
        }
      );
      selectedTemplate.previewMessage = finalMessage;
    }
    finalMessage = selectedTemplate.previewMessage

    

    // ✅ validate phone numbers
    const numbersInfo = await validatePhoneNumbers(
      numbersString,
      value.totalNo
    );

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
      message: finalMessage,
    });
    console.log(finalMessage, "message");

    return res.status(201).json({
      message: "Sending job queued successfully",
      msgId: baseMessageId,
      totalNumbers: numbersInfo.length,
      message: finalMessage,
    });
  } catch (err) {
    console.error("Error in createSending:", err);
    return res.status(500).json({ message: err.message });
  }
};
