const User = require("../models/user.model");
const verifyToken = require("../middlewares/verifyToken");
const USERTYPEADMIN = require("../utils/randomId");
const redisClient = require("../config/redis");
const {setKey, getKey} = require("../config/redis")

exports.addCredit = async (req, res) => {
  try {
    const { userType, userId: parentId } = req.userInfo;
    console.log(userType);
    const { balance, description, balanceType, userId } = req.body;
    const creditedUser = await User.findOne({ userId });
    if (!creditedUser) {
      throw new Error("User to credit not found");
    }

    if (balanceType === "credit") {
      if (!userType === USERTYPEADMIN && userId === parentId) {
        throw new Error("Resellers cannot add credit to themselves");
      }
      let parentBalance;
      parentBalance = await User.findOne({ userId: parentId }, { balance });
      if (!parentBalance) {
        throw new Error("Parent user not found");
      }
      if (parentBalance.balance < balance) {
        throw new Error("Not enough balance");
      }

      if (userType === USERTYPEADMIN) {
      } else if (userType === "Reseller") {
        if (
          creditedUser.userType !== "Child" ||
          creditedUser.parentId !== parentId
        ) {
          throw new Error(
            "Reseller can only add credit to their own child accounts"
          );
        }
      } else {
        throw new Error("User type not authorized to add credit");
      }
      await User.findOneAndUpdate(
        { userId: parentId },
        { $inc: { balance: -balance } }
      );
      const updatedCreditedUser = await User.findOneAndUpdate(
        { userId },
        { $inc: { balance: balance } },
        { new: true }
      );
      await setKey(userId, updatedCreditedUser)
      
      return res.status(200).json(updatedCreditedUser);

      // debit condition
    } else if (balanceType === "debit") {
      if (userType !== USERTYPEADMIN && userId === parentId) {
        throw new Error("Resellers or Child  cannot add credit to themselves");
      }
      const debitUser = User.findOne({ balance });
      if (debitUser.balance < balance) {
        throw new Error("Not enough balance");
      }
      if (
        userType !== USERTYPEADMIN &&
        userType !== "Reseller" &&
        debitUser.userId == parentId
      ) {
        throw new Error("Not authorzed");
      }
      await User.findOneAndUpdate(
        { userId: parentId },
        { $inc: { balance: balance } }
      );
      const updateDebitUser = await User.findOneAndUpdate(
        { userId },
        { $inc: { balance: -balance } }
      );
      return res.status(200).json(updateDebitUser);
      console.log(updateDebitUser);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getCredits = async (req, res) => {
  try {
    const { userId } = req.body;
    const credits = await User.findOne({ userId });
    console.log(credits, "balance");
   const data = await getKey(userId)
  
    if (data) {
      console.log("data From Redis");
      return res.status(200).json(JSON.parse(data));
    } else {
      return res.status(200).json(credits.balance);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
