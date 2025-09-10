const Stats = require("../models/stats.model");

exports.statsRecord = async (userId, countryCode) => {
    const existingRecord = await Stats.findOne({userId});
    if (existingRecord) {
       await  Stats.findOneAndUpdate({ userId }, { $inc: { messageSent: 1 } })
    } 
    const newRecord = await Stats.create({
        userId,
        country: countryCode,
        date: new Date(),
        messageSent : 1
    })
    return newRecord
    

}
