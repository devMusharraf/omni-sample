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
const sendEmail = require("../utils/nodemailer")

exports.sendingEmail = async (req, res) => {
  try {
    const { userId, parentId } = req.userInfo;
    const { emailId, totalEmail, campaignName, templateId } = req.body;
  
    const email = emailId.split(",").map((e) => e.trim());
   

    const templateData = await getFromRedis(`${userId}:template`);
    const selectedTemplate = await getTemplate(templateData, templateId);
     sendEmail(email, "testing template", selectedTemplate.previewMessage);

    return res.status(201).json({ email, message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
