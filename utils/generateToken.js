const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  try {
    const token = jwt.sign(
      {
        userId: user.userId,           
        userType: user.userType,
        parentId: user.parentId  
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    return token;
  } catch (error) {
    console.log(error);
  }
  console.log("Generating token for:", user.userId, user.resellerId);
};

module.exports = generateToken;
