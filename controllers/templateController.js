const Template = require("../models/template.model");
const { USERTYPEADMIN, ADMINID } = require("../utils/randomId");
const User = require("../models/user.model");
const { setKey, getKey, addToRedis, getFromRedis } = require("../config/redis");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// C
exports.createTemplate = async (req, res) => {
  try {
    const { parentId, userId } = req.userInfo;
    const { messageType, textArea, variables, index } = req.body;

    if (!messageType || !textArea) {
      return res
        .status(400)
        .json({ error: "messageType and textArea are required" });
    }

    if (!variables) {
      return res.status(400).json({ error: "Variables mapping is required" });
    }

    let variableMapping;
    try {
      variableMapping = JSON.parse(variables);
      if (!Array.isArray(variableMapping) || variableMapping.length === 0) {
        throw new Error();
      }
    } catch {
      return res
        .status(400)
        .json({ error: "Variables must be a valid JSON array" });
    }

    let text_variable = [];

    // ---------------- Handle File Upload ----------------
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const rows = [];

      if (ext === ".csv") {
        await new Promise((resolve, reject) => {
          fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (row) => rows.push(row))
            .on("end", resolve)
            .on("error", reject);
        });
      } else if (ext === ".xlsx" || ext === ".xls") {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetRows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        rows.push(...sheetRows);
      }

      text_variable = rows.map((row) => {
        const mapped = {};
        variableMapping.forEach((v) => {
          mapped[v.name] = row[v.header] || "";
        });
        return mapped;
      });
    }

    // default values if no CSV
    if (!Array.isArray(text_variable) || text_variable.length === 0) {
      text_variable = [
        variableMapping.reduce((acc, v) => ({ ...acc, [v.name]: "" }), {}),
      ];
    }

    // ---------------- Generate Preview ----------------
    let previewMessage = textArea.replace(/\{\{(\w+)\}\}/g, (match, name) => {
      if (text_variable[index] && text_variable[index][name] !== undefined) {
        return text_variable[index][name];
      }
      return match;
    });

    const template = new Template({
      messageType,
      textArea,
      variables: variableMapping,
      text_variable,
      previewMessage,
      createdAt: new Date(),
      userId,
      parentId: parentId || null,
    });

    await template.save();
    await addToRedis(`${userId}:template`, template);

    return res.status(201).json(template);
  } catch (error) {
    console.error("Error in createTemplate:", error);
    return res.status(500).json({ error: error.message });
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
