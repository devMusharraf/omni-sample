const Joi = require("joi");
exports.userValidator = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .error(new Error("Please Provide valid Username")),
  userType: Joi.string()
    .required()
    .allow("Reseller", "User")
    .error(new Error("Enter a valid userType")),
  email: Joi.string().email().required(),
  mobile: Joi.string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required()
    .error(new Error("The mobile no. should be of 10 digits")),
  password: Joi.string().required(),
  rePassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "The rePassword should be the same as password",
    "any.required": "rePassword is required",
  }),
  service: Joi.array()
    .required()
    .error(new Error("the services cant be empty")),
});

exports.serviceValidator = Joi.object({
  serviceName: Joi.array().min(1).max(3).required().messages({
    "array.min": "Services can't be empty",
    "any.required": "Services can't be empty",
  }),
  isActive: Joi.boolean(),
  serviceId: Joi.string(),
});

exports.balanceValidator = Joi.object({
  balance: Joi.number()
    .min(1)
    .positive()
    .required()
    .error(new Error("Enter a value greater than 0")),
  balanceType: Joi.string()
    .valid("credit", "debit")
    .required()
    .error(new Error("Please select the balance type")),
  description: Joi.string()
    .required()
    .min(5)
    .max(100)
    .error(new Error("Please mention description")),
  userId: Joi.string().required().error(new Error("Please enter userId")),
});

exports.templateValidator = Joi.object({
  messageType: Joi.string()
    .required()
    .error(new Error("Please enter a message Type")),
  textArea: Joi.string()
    .min(2)
    .max(200)
    .required()
    .error(
      new Error("Enter a message, the keywords should be between 2 to 200")
    ),
  isVariable: Joi.boolean().optional().error(new Error("Select a valid value")),
  text_variable: Joi.array()
    .optional()
    .error(new Error("text variable will be in array format")),

});

exports.messageValidator = Joi.object({
  templateId: Joi.string()
    .length(10)
    .alphanum(10)
    .required()
    .error(new Error("enter a valid template id")),
  channel: Joi.alternatives()
    .try(
      Joi.string().valid("WhatsApp", "SMS", "RCS"),
      Joi.array().min(1).items(Joi.string().valid("WhatsApp", "SMS", "RCS"))
    )
    .required()
    .error(new Error("Enter a valid channel name")),
  recipient: Joi.string().required().error(new Error("Enter recipient name")),
 
  userId: Joi.string()
    .alphanum()
    .length(10)
    .required()
    .error(new Error("Enter a valid userId")),
  cost: Joi.number().required().error(new Error("Enter the cost")),
  text_variable: Joi.array()
    .min(1)
    .required()
    .error(new Error("Variables are compulsary")),
});


exports.gatewayValidator = Joi.object({
  
  
  gatewayName: Joi.string()
    .required()
    .messages({ "any.required": "Gateway name is required" }),
  
  
  
  price: Joi.array()
    .items(
      Joi.object({
        textArea: Joi.number()
          .required()
          .messages({ "any.required": "Price for textArea is required" }),
        text_variable: Joi.number()
          .required()
          .messages({ "any.required": "Price for text_variable is required" }),
      })
    )
    .min(1)
    .required()
    .messages({ "array.min": "At least one price entry is required" }),
  
 
  
  service: Joi.array()
    .items(Joi.string())
    .default([]).error(new Error("Service are compulsary")),
});


exports.sendingSchema = Joi.object({
  userId: Joi.string(),
  number:Joi.string().required(),
  templateId: Joi.string().required().max(10).error(new Error("Enter a valid  templateId")),
  gatewayId: Joi.string().required().max(10).error(new Error("Enter a valid gatewayId")),
  totalNo: Joi.number().required().min(1).error(new Error("Enter the quantity of numbers")),
  campaignName: Joi.string().required().error(new Error("Please enter the campaign name")),
  senderId: Joi.string(),
  msgId: Joi.string()
})