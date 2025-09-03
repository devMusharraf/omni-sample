// async function gatewayPrice(selectedTemplate, gatewayData) {
//   if (!gatewayData) {
//     throw new Error("gatewayData is undefined");
//   }

  
//   const gateway = Array.isArray(gatewayData) ? gatewayData[0] : gatewayData;

//   if (!gateway || !gateway.price || gateway.price.length === 0) {
//     throw new Error("Invalid gatewayData: price not found");
//   }

//   let price;
//   if (selectedTemplate.isVariable === true) {
//     price = gateway.price[0].text_variable;
//   } else {
//     price = gateway.price[0].textArea;
//   }

//   return Number(price);
// }



// module.exports = gatewayPrice;