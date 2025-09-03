const otpGenerator = require("otp-generator");
const OTP = require("../models/otp.model");
const User = require("../models/user.model");
const mailSender = require("../utils/mailSender");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(401).json({ message: "User already registered" });
    }
     let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
   
   
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
   
    res.status(200).json({
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const isOtp = OTP.findOne({ otp });
    if (isOtp) {
      return res.status(200).json({
        message: "OTP verified",
      });
    } else {
      return res.status(404).json({ message: "Incorrect OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.signupUser = async (req, res) => {
try {
      const { username, email, password, rePassword, userType, otp } = req.body;
  const sentOtp = OTP.findOne({otp});
    if(!sentOtp || sentOtp !== otp) {
return res.json("Invalid OTP")
  }
 const otpEmail = OTP.findOne({email})
 
  if(sentOtp){
    const newUser = await User.create({username, email, password, rePassword, userType})
return res.status(201).json({newUser, message: "new user created"})
  }

} catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message})
}

};
