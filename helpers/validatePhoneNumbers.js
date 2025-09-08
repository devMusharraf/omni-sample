const { parsePhoneNumberFromString } = require("libphonenumber-js");

async function validatePhoneNumbers(numbersString, expectedCount) {
  if (!numbersString || typeof numbersString !== "string") {
    throw new Error("`number` must be a comma-separated string of phone numbers.");
  }

  const tokens = numbersString
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const results = tokens.map((raw) => {
    let phone = parsePhoneNumberFromString(raw);

    if ((!phone || !phone.isValid()) && !raw.startsWith("+")) {
      phone = parsePhoneNumberFromString("+" + raw);
    }

    if (!phone || !phone.isValid() || !phone.country) {
      throw new Error(`Invalid phone number: "${raw}"`);
    }

    return {
      input: raw,
      formatted: phone.number,          // E.164 format
      country: phone.country.toUpperCase(), // Always uppercase
    };
  });

  if (results.length !== Number(expectedCount)) {
    throw new Error(
      `totalNo mismatch: expected ${expectedCount} but found ${results.length} numbers.`
    );
  }

  return results;
}

module.exports = validatePhoneNumbers;
