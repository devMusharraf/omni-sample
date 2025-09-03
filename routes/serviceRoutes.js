const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const verifyToken = require("../middlewares/verifyToken");
const {serviceValidatorMiddleware} = require("../middlewares/validatorMiddleware")

router.post("/add-service", serviceValidatorMiddleware, verifyToken, serviceController.addService)
router.get("/services", verifyToken, serviceController.getServices)
router.put("/edit-service/:serviceId", serviceValidatorMiddleware, verifyToken, serviceController.editService)
router.delete("/delete-service/:serviceId", verifyToken, serviceController.deleteService)
router.get("/single-service", serviceController.getOneService)

module.exports = router;