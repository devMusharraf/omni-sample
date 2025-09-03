function validatePhoneNumbers(numbers, expectedCount) {
  const numberArray = numbers.split(",").map((n) => n.trim());
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  numberArray.forEach((num) => {
    if (!phoneRegex.test(num))
      throw new Error(`Invalid phone number format: ${num}`);
  });

  if (numberArray.length !== expectedCount) {
    throw new Error("Invalid number count")
  }



return numberArray.length
}
module.exports = validatePhoneNumbers;
