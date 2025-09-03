const getCampaignAnalytics = require("../helpers/getCampaignAnalytics");

 exports.campaignAnalyticsController = async (req, res) => {
try {
    const { campaignName } = req.params;
    if (!campaignName) {
        return res.status(400).json({ message: "Campaign name is required"})
    }
      console.log(campaignName, "camapign name")

    const analytics = await getCampaignAnalytics(campaignName);
    return res.json({ campaignName, analytics});
  
} catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
}
}