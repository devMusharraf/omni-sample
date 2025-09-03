const sendMessage = require("../models/sendMessage.model");

async function getCampaignAnalytics(campaignName) {
  const pipeline = [
    { $match: { campaignName } },
    {
      $group: {
        _id: "$status",
        cont: { $sum: 1 },
        totalCost: { $sum: "$perMessageCost" },
      },
    },
  ];

  const results = await sendMessage.aggregate(pipeline);
  const analytics = {
    pending: 0,
    sent: 0,
    delivered: 0,
    failed: 0,
    totalCost: 0,
  };

  results.forEach((r) => {
    analytics[r._id] = r.count;
    analytics.totalCost += r.totalCost;
  });

  return analytics;
}

module.exports = getCampaignAnalytics;