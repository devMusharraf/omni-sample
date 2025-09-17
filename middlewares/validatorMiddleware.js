const {
  userValidator,
  serviceValidator,
  balanceValidator,
  templateValidator,
  messageValidator,
  gatewayValidator
} = require("../utils/validator");

exports.userValidatorMiddleware = async (req, res, next) => {
  const userpayload = {
    username: req.body.username,
    userType: req.body.userType,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    rePassword: req.body.password,
    service: req.body.service,
  };
  const { error, value } = userValidator.validate(userpayload);

  if (error) {
    console.error("Validation failed:", error.details);
    return res.status(403).json({ message: error.message });
  } else {
    console.log("Validation succeeded:", value);
  }
  next();
};

exports.serviceValidatorMiddleware = async (req, res, next) => {
  const servicepayload = {
    serviceName: req.body.serviceName,
    isActive: req.body.isActive,
  };
  const { error, value } = serviceValidator.validate(servicepayload);

  if (error) {
    console.error("Validation failed:", error.details);
    return res.status(403).json({ message: error.message });
  } else {
    console.log("Validation succeeded:", value);
  }
  next();
};

exports.balanceValidatorMiddleware = async (req, res, next) => {
  const balancepayload = {
    balance: req.body.balance,
    balanceType: req.body.balanceType,
    description: req.body.description,
    userId: req.body.userId,
  };
  const { error, value } = balanceValidator.validate(balancepayload);

  if (error) {
    console.error("Validation failed:", error.details);
    return res.status(403).json({ message: error.message });
  } else {
    console.log("Validation succeeded:", value);
  }
  next();
};

exports.templateMiddleware = async (req, res, next) => {
  const templatePayload = {
    messageType: req.body.messageType,
    textArea: req.body.textArea,
    isVariable: req.body.isVariable,
    text_variable: req.body.text_variable,
    vari: req.body.vari
  }
  const { error, value } = templateValidator.validate(templatePayload)

  if (error) {
    console.error(error.details)
      return res.status(403).json({ message: error.message });
  }
  else {
    console.log("validation successful");
    
  }
  next();
}


exports.messageMiddleware = async (req, res, next) => {
  const messagePayload = {
    templateId: req.body.templateId,
   channel: req.body.channel,
   recipient: req.body.channel,
   userId: req.body.userId,
   text_variable: req.body.text_variable
  }
  const { error, value } = messageValidator.validate(messagePayload)

  if (error) {
    console.error(error.details)
      return res.status(403).json({ message: error.message });
  }
  else {
    console.log("validation successful");
    
  }
  next();
}

exports.gatewayMiddleware = async (req, res, next) => {
const gatewayPayload = {
  gatewayName: req.body.gatewayName,
  // price: req.body.price,
  service: req.body.service

}
const {error, value} = gatewayValidator.validate(gatewayPayload)

 if (error) {
    console.error(error.details)
      return res.status(403).json({ message: error.message });
  }
  else {
    console.log("validation successful");
    
  }
  next();
}


