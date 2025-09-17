const { createTemplate, getTemplate, updateTemplate, deleteTemplate, getTemplatebyId }  = require("../controllers/templateController");
const express = require("express");
const { templateMiddleware } = require("../middlewares/validatorMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload")
const router = express.Router();

router.post("/create-template",upload.single("file"), verifyToken,  createTemplate)
router.get("/templates", verifyToken, getTemplate)
router.put("/update-template/:templateId",templateMiddleware, verifyToken, updateTemplate)
router.delete("/delete-template/:templateId", verifyToken, deleteTemplate)
router.get("/template/:templateId", verifyToken, getTemplatebyId)

module.exports = router


