const express = require("express");
const router = express.Router();
const User = require("../models/user.model")
const generateToken = require("../utils/generateToken")
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const {userValidatorMiddleware} = require("../middlewares/validatorMiddleware");

router.post("/new-admin", async (req, res) => {
   try {
     const {userName, email, password} = req.body;
     
     
    const user = await User.create({
        userName,
        email,
        password,
        userType: "admin"
    
      
       
       
    })
    const token = generateToken(user)
    return res.status(201).json({
        user,
        token
    })
   } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message})
   }

})

router.post("/add-user", userValidatorMiddleware, verifyToken, userController.addUser);
router.post("/login-user", userController.loginUser);
router.get("/get-child", userController.getChilds)
router.get("/get-user", userController.getUser)

module.exports = router;