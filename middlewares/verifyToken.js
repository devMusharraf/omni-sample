const jwt = require("jsonwebtoken");


const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send("Authorization failed. No access token.");
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    req.userInfo = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = verifyToken;
