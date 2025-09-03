const {addCredit, getCredits} = require("../controllers/balanceController");
const express = require("express");
const router = express.Router();
const {balanceValidatorMiddleware} =  require("../middlewares/validatorMiddleware")
const verifyToken = require("../middlewares/verifyToken");

router.post("/add-credit", verifyToken, balanceValidatorMiddleware, addCredit)
router.get("/get-credits", getCredits)

module.exports = router;