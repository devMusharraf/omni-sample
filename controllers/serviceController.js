const Service = require("../models/service.model");
const verifyToken = require("../middlewares/verifyToken");
const { setKey, getKey } = require("../config/redis");
exports.addService = async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const { serviceName, isActive } = req.body;
    const service = await Service.create({
      serviceName,
      isActive,
      userId,
    });
    await setKey(service.serviceId, service);
    return res.status(201).json(service);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getOneService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const oneService = await Service.findOne({ serviceId });
    if (!oneService) {
      return res.status(404).json({ message: "Service not found" });
    }
    const data = await getKey(serviceId);
    if (data) {
      console.log("data fetched from redis");
      return res.json(data);
    } else {
      return res.status(200).json(oneService);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.editService = async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const { serviceId } = req.params;

    const { serviceName, isActive } = req.body;
    const updatedService = await Service.findOneAndUpdate(
      { serviceId },
      { serviceName, isActive, userId },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json(updatedService);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    await Service.findOneAndDelete(serviceId);
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
