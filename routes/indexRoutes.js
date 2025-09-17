const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { sendMessage } = require("../controllers/messageController");
const {
  messageMiddleware,
  gatewayMiddleware,
} = require("../middlewares/validatorMiddleware");
const {
  addGateway,
  getAllGateway,
  editGateway,
  deleteGateway,
  getOneGateway,
} = require("../controllers/gatewayController");
const sendEmail = require("../utils/nodemailer")
const { getUser } = require("../controllers/userController")
const otpController = require("../controllers/otpController");
const { createSending, getSending } = require("../controllers/sendingController");
const { sendingEmail } = require("../controllers/sendingEmail");
const rateLimiter = require("../middlewares/rateLimiter");
const upload = require("../middlewares/upload")

// router.post("/send-message", verifyToken, messageMiddleware, sendMessage);


// gateway routes
router.post("/add-gateway", verifyToken, addGateway);
router.get("/get-gateway", getAllGateway);
router.get("/one-gateway/:gatewayId",verifyToken, getOneGateway);
router.put("/edit-gateway/:gatewayId", gatewayMiddleware, editGateway);
router.delete("/delete-gateway/:gatewayId", deleteGateway);



router.post("/send-email", sendEmail)
router.post("/template-email",verifyToken, sendingEmail)


// user route
router.get("/get-users",rateLimiter, getUser)

router.post("/send-otp", otpController.sendOTP)
router.post("/signup-user", otpController.signupUser)


//sending routes 
router.post("/sending", verifyToken, upload.single("file"), createSending)
// router.post("/send", upload.single("numbersFile"), createSending);
// router.get("/get-sending", verifyToken, getSending )




module.exports = router;
