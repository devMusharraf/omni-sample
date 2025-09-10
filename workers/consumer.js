// worker/consumer.js
require("dotenv").config();
const mongoose = require("mongoose");
const { consumeQueue } = require("../utils/rabbitmq");

// helpers & models
const balanceDeduct = require("../helpers/balanceDeduct");
const sendNumbers = require("../models/sendNumbers.model");
const sendMessage = require("../models/sendMessage.model");
const Transaction = require("../models/transaction.model");
const { statsRecord } = require("../helpers/statsRecord");


// 1. Connect MongoDB
async function connectDB() {
  try {
    const MONGO_URI = "mongodb://localhost:27017/service-flow";
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Worker connected to MongoDB");
  } catch (err) {
    console.error("❌ Worker failed to connect MongoDB:", err);
    process.exit(1);
  }
}
connectDB();

// 2. Process messages
async function processMessages(data) {
  console.log("🚀 Worker received job:", data.jobId);

  try {
    const {
      jobId,
      userId,
      templateId,
      gatewayId,
      campaignName,
      numbers,
      messageType,
 
    } = data;
    console.log(numbers, "total numbers");
    const value = numbers.map((t) => t.formatted);
    console.log(value);

    // Group numbers by country
    let groupedByCountry = {};
    if (numbers && Array.isArray(numbers) && numbers.length > 0) {
      groupedByCountry = numbers.reduce((acc, num) => {
        const iso = num.country;
        if (!acc[iso]) acc[iso] = [];
        acc[iso].push(num.formatted);
        return acc;
      }, {});
    } else {
      console.warn("⚠️ No numbers found in payload. Skipping job:", jobId);
      return;
    }

    console.log("📊 Grouped by country:", groupedByCountry);

    let totalCampaignCost = 0;
    if (scheduledAt === false) {
      for (const [countryIso, nums] of Object.entries(groupedByCountry)) {
        // Deduct balance
        const { perMessageCost, totalCost } = await balanceDeduct(
          userId,
          messageType || "text",
          countryIso,
          nums.length
        );
        console.log(nums.length, "nums.length");

        totalCampaignCost += totalCost;
        console.log(
          `💰 Deducted balance: totalCost=${totalCost}, perMessage=${perMessageCost}`
        );
        // Update summary
        await sendMessage.create({
          campaignName,
          templateId,
          gatewayId,
          senderId: userId,
          number: nums.join(","),
          numCount: nums.length,
          msgId: jobId,
          totalCost: totalCampaignCost,
          status: "sent",
        });
        console.log(sendMessage, "sendMessage");
        // Insert per-number records
        const sendNumbersDocs = nums.map((num, i) => ({
          senderId: userId,
          campaignName,
          number: num,
          templateId,
          gatewayId,
          msgId: `${jobId}:${countryIso}:${i + 1}`,
          perMessageCost,
          countryCode: countryIso,
        }));
        const updateRecord = await statsRecord(userId, countryIso);
        console.log(updateRecord, "record");

        await sendNumbers.insertMany(sendNumbersDocs);
        console.log(`✅ Inserted ${nums.length} sendNumbers for ${countryIso}`);

        // Log transaction
        await Transaction.create({
          userId,
          amount: totalCost,
          type: "message sent",
          createdAt: Date.now(),
        });

        console.log(`📌 Transaction logged for ${countryIso}`);
      }

      console.log(
        `🎉 Worker finished job: ${jobId}, totalCost=${totalCampaignCost}`
      );
    }
   
 
  } catch (err) {
    console.error("❌ Error in processMessages:", err);
    throw err; // rethrow so RabbitMQ requeues
  }
}

// 3. Start consuming
consumeQueue("processing_message", async (data) => {
  try {

    await processMessages(data);
  } catch (err) {
    console.error("❌ Job failed, will be requeued:", err);
    throw err;
  }
});
