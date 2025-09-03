// const { phone } = require("phone");

// const phoneValidation = async (req, res) => {
//   try {
//     const phoneno = "18004190157";
//     const isValid = phone(phoneno);
//     console.log(isValid)
//     if (isValid) {
//       return res.status(200).json({
//         message: "Valid phone number",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error.message });
//   }
// };
// phoneValidation();

// const { parsePhoneNumberFromString } = require("libphonenumber-js");

// function validatePhoneNumber(input) {
//   try {
//     if (!input || typeof input !== "string") {
//       return { valid: false, reason: "No phone number provided" };
//     }

//     const cleanInput = input.replace(/[\s\-().]/g, "");

//     if (!cleanInput.startsWith("+")) {
//       return { valid: false, reason: "Number must start with country code (+)" };
//     }

//     const phoneNumber = parsePhoneNumberFromString(cleanInput);

//     if (!phoneNumber) {
//       return { valid: false, reason: "Could not parse phone number" };
//     }

//     let type = "unknown";
//     const kind = phoneNumber.getType();
//     if (kind === "MOBILE") type = "mobile";
//     else if (kind === "FIXED_LINE") type = "landline";
//     else if (kind === "TOLL_FREE") type = "toll-free";

//     return {
//       valid: true,
//       number: phoneNumber.number,
//       country: phoneNumber.country,
//       type,
//     };

//   } catch (err) {
//     return { valid: false, reason: "Unexpected error while validating" };
//   }
// }

// console.log(validatePhoneNumber("+919069774916"));

const libphonenumber = require("google-libphonenumber");
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

function validatePhoneNumber(input) {
  try {
    if (!input || typeof input !== "string") {
      return { valid: false, reason: "No phone number provided" };
    }
    input = input.replace(/[\s\-().]/g, "");
    const number = phoneUtil.parseAndKeepRawInput(input);
    const region = phoneUtil.getRegionCodeForNumber(number);
    const typeEnum = libphonenumber.PhoneNumberType;
    const type = phoneUtil.getNumberType(number);

    let typeStr = "unknown";
    if (type === typeEnum.MOBILE) typeStr = "mobile";
    else if (type === typeEnum.FIXED_LINE) typeStr = "landline";
    else if (type === typeEnum.TOLL_FREE) typeStr = "toll-free";
    else if (type) typeStr = "other";
   
    return {
      valid: true,
      number: "+" + number.getCountryCode() + "" + number.getNationalNumber(),
      country: region,
      type: typeStr,
    };
  } catch (err) {
    return { valid: false, reason: "Parse error" };
  }
}

console.log(validatePhoneNumber("+911800114000"));
