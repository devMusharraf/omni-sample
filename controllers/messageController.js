// const Message = require("../models/message.model");
// const Template = require("../models/template.model");
// const deductBalance = require("../utils/deductBalance");
// const { ADMINID, USERTYPEADMIN } = require("../utils/randomId");
// const User = require("../models/user.model");
// const redisClient = require("../utils/redis");

// exports.sendMessage = async (req, res) => {
//   try {
//     const { userType } = req.userInfo;
//     const { templateId, channel, recipient, userId, text_variable } = req.body;
//     let userData = await redisClient.get(`user:${userId}`);
//     let targetUser;
//     if (userData) {
//       targetUser = JSON.parse(userData);
//     } else {
//       targetUser = await User.findOne({ userId });
//       if (!targetUser) throw new Error("Target user not found");

//       await redisClient.set(`user:${userId}`, JSON.stringify(targetUser), "EX", 600);
//     }

//     const template = await Template.findOne({ templateId });
//     if (!template) throw new Error("Template not found");

//     let finalMessage = template.textArea;
//     if (template.textArea && Array.isArray(text_variable)) {
//       finalMessage = template.textArea.replace(
//         /\{\{(\d+)\}\}/g,
//         (match, index) => {
//           const i = parseInt(index, 10) - 1;
//           return text_variable[i] || match;
//         }
//       );
//     }

//     const message = await Message.create({
//       channel,
//       recipient,
//       content: finalMessage,
//       userId,
//       parentId: targetUser.parentId,
//       templateId: template.templateId
//     });

//     if (message) {
//       let deductBalanceUser = 0;
//       let parentDeduct = 0;

//       if (userType === "Reseller") {
//         deductBalanceUser = 7;
//         parentDeduct = 5;
//       }
//       if (userType === USERTYPEADMIN && targetUser.userType === "Child") {
//         deductBalanceUser = 7;
//         parentDeduct = 3;
//       }
//       if (userType === USERTYPEADMIN && targetUser.userType === "Reseller") {
//         deductBalanceUser = 5;
//         parentDeduct = 3;
//       }

//       await deductBalance(
//         userId,
//         deductBalanceUser,
//         "message",
//         message.msgId
//       );
//       if (targetUser.balance !== undefined) {
//         targetUser.balance -= deductBalanceUser;
//         await redis.set(
//           `user:${userId}`,
//           JSON.stringify(targetUser),
//           "EX",
//           600
//         );
//       }

//       if (targetUser.parentId) {
//         if (targetUser.parentId === ADMINID) {
//           await deductBalance(ADMINID, 3, "message", message.msgId);
//         } else {
//           await deductBalance(
//             targetUser.parentId,
//             parentDeduct,
//             "message",
//             message.msgId
//           );
//         }
//       }
//       let parentData = await redis.get(`user:${targetUser.parentId}`);
//       if (parentData) {
//         parentData = JSON.parse(parentData);
//         parentData.balance -= parentDeduct;
//         await redis.set(
//           `user:${targetUser.parentId}`,
//           JSON.stringify(parentData),
//           "EX",
//           600
//         );
//       }
//     }

//     return res.status(201).json(message);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message });
//   }
// };
