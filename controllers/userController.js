const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const redisClient = require("../config/redis");
const { setKey, getKey } = require("../config/redis");

exports.addUser = async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const {
      username,
      email,
      password,
      rePassword,
      userType,
      mobile,
      service,
      balance,
      balanceType,
      description,
    } = req.body;
    if (password !== rePassword) {
      throw new Error(["Password does not match"]);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existUser = await User.existUser({ username });
    if (existUser) {
      throw new Error([400, "User Exist"]);
    }

    // if (req.userInfo.userType === "Reseller" || "Child" && req.body.balance > 0){
    // throw new Error(["You cannot add credit in your account"])

    // };

    //   const superAdmin = User.findOne({userType});
    //   if (superAdmin.userType === "Super Admin"){
    //  const  superAdminBalance =  res.json({
    //   superAdmin: {
    //     balance: superAdmin.balance
    //   }
    //  })
    //   if (userType === "Reseller" || "Child" && balanceType === "credit"){
    //     this.balance = superAdminBalance - req.body.balance
    //   }
    const data = await User.addUser({
      parentId: userId,
      username,
      email,
      password: hashedPassword,
      userType,
      mobile,
      service,
      balance,
      balanceType,
      description,
    });
    
    
    await setKey(`user:${data?.userId}`, JSON.stringify(data))

    return res.status(201).json({
      message: "User Created Successfully!!",
      userInfo: { username, password: hashedPassword }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const token = generateToken(user);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getChilds = async (req, res) => {
  try {
    const { parentId } = req.body;
    const AllChild = await User.find({ parentId });
    if (!AllChild) {
      throw new Error("No users found");
    }
    return res.status(200).json({
      message: "Child Fetched Successfully!!",
      AllChild: {
        username: AllChild.map((item) => {
          return item.username;
        }),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.body;

   
    const data = await getKey(`user:${userId}`);
  

    if (data) {
      console.log("From Redis");
      return res.json(JSON.parse(data));
    }
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // await redisClient.setEx(cacheKey,  60, JSON.stringify(user));
    // console.log("Data fetched from MongoDB and cached in Redis");
    return res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
