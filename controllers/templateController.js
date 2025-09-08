const Template = require("../models/template.model");
const { USERTYPEADMIN, ADMINID } = require("../utils/randomId");
const User = require("../models/user.model");
const { setKey, getKey, addToRedis, getFromRedis } = require("../config/redis");

// C
exports.createTemplate = async (req, res) => {
  try {
    const { userType, parentId, userId } = req.userInfo;
    console.log(userType);
    const { messageType, textArea, text_variable } = req.body;
    const targetUser = await User.findOne({ userId });
    if (userType === USERTYPEADMIN || targetUser?.parentId === userId) {
      throw new Error("you cannot send message for yourself");
    }

    let previewMessage;
    if (messageType === "text_variable") {
      if (!Array.isArray(text_variable) || text_variable.length === 0) {
        throw new Error("Variable type message requires text_variable array");
      }

      previewMessage = textArea.replace(/\{\{(\d+)\}\}/g, (match, index) => {
        const i = parseInt(index, 10) - 1;
        return text_variable[i] || match;
      });
    } else {
      previewMessage = textArea;
    }
    const data = await Template.addTemplate({
      messageType,
      textArea,

      text_variable: messageType === "text_variable" ? text_variable : [],
      userId,
      parentId: targetUser.parentId || "",
      previewMessage,
    });

    console.log(await addToRedis(`${userId}:template`, data), "----");

    // if (data) {
    //   if (userType === "Reseller") {
    //     deductBalance = 7;
    //     parentDeduct = 5;
    //   }
    //   if (userType === USERTYPEADMIN && targetUser.userType === "Child") {
    //     deductBalance = 7;
    //     parentDeduct = 3;
    //   }
    //   if (userType === USERTYPEADMIN && targetUser.userType === "Reseller") {
    //     deductBalance = 5;
    //     parentDeduct = 3;
    //   }

    //   await User.findOneAndUpdate(
    //     { userId },
    //     { $inc: { balance: -deductBalance } }
    //   );
    //   if (ADMINID === targetUser.parentId) {
    //     await User.findOneAndUpdate(
    //       { userId: ADMINID },
    //       { $inc: { balance: -3 } }
    //     );
    //   } else if (targetUser.parentId) {

    //     await User.findOneAndUpdate(
    //       { userId: targetUser.parentId },
    //       { $inc: { balance: -parentDeduct } }
    //     );
    //   }

    //   if (parentId && parentId !== ADMINID) {
    //     await User.findOneAndUpdate(
    //       { userId: parentId },
    //       { $inc: { balance: -parentDeduct } }
    //     );
    //   }
    // }
    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// R
exports.getTemplate = async (req, res) => {
  try {
    const templates = await Template.getTemplate();
    return res.status(200).json(templates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// U
exports.updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { messageType, textArea, isVariable } = req.body;
    console.log("Searching for templateId:", templateId);
    const updatedTemplate = await Template.editTemplate(
      { templateId },
      { messageType, textArea, isVariable },
      { new: true }
    );
    console.log(updatedTemplate);
    return res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// D
exports.deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    await Template.deleteTemplate({ templateId });
    return res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getTemplatebyId = async (req, res) => {
  try {
    const { userId } = req.userInfo;

    console.log(userId);
    const template = await Template.getOneTemplate({ templateId });
    const data = await getKey(`template:${userId}`);
    if (data) {
      console.log("data from redis");
      return res.status(200).json(data);
    }
    return res.status(200).json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
