const Gateway = require("../models/gateway.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const redisClient = require("../config/redis");
const { setKey, getKey, addToRedis, getFromRedis } = require("../config/redis");

exports.addGateway = async (req, res) => {
  try {
    const { userId: parentId  } = req.userInfo;



    const { gatewayName, service, price, userId, gatewayId } = req.body;
   
    await Service.create({
      userId,
      service,
    });
    const newGateway = await Gateway.create({
      gatewayName,
      service,
      price,
      userId,
      parentId,
      gatewayId
    });
   
const user =   await User.findOneAndUpdate(
  { userId },
  { service, gatewayId: newGateway.gatewayId }, 
  { new: true } 
);

 const parentGateway = await Gateway.findOne({userId: parentId})
 const adminGateway = await Gateway.findOne({userId: parentGateway.parentId})

 const userData =  await addToRedis(`${userId}:gateway`, newGateway);
const parentData = await addToRedis(`${parentId}:gateway`, parentGateway)

 const adminData = await addToRedis(`${parentGateway.parentId}:gateway`, adminGateway)

 
    return res.status(201).json(newGateway);
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllGateway = async (req, res) => {
  try {
    const allGateways = await Gateway.find();
    return res.status(200).json(allGateways);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getOneGateway = async (req, res) => {
  try {
    const { userId } = req.userInfo;
   
    const { gatewayId } = req.params;
    
    const gateway = await Gateway.findOne({ gatewayId });
    if (!gateway) throw new Error("gateway not found");
   

    const data = await getKey(`gateway:${userId}`);
    console.log(data)
    
    if (data) {
      console.log("data is coming from redis", data)
      return res.status(200).json(data);
    } else {
      return res.status(200).json(gateway);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.editGateway = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const { gatewayName, price, service } = req.body;
    const updatedGateway = await Gateway.findOneAndUpdate(
      { gatewayId },
      { gatewayName, price, service },
      { new: true }
    );
    return res.status(200).json(updatedGateway);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteGateway = async (req, res) => {
  try {
    const { gatewayId } = req.params;

    const deletedGateway = await Gateway.findOneAndDelete({
      gatewayId: gatewayId.trim(),
    });

    if (!deletedGateway) {
      return res.status(404).json({ message: "Gateway not found" });
    }

    return res.status(200).json({ message: "Gateway deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
