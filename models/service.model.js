const mongoose = require("mongoose");
const {randomId} = require("../utils/randomId")

const serviceSchema = new mongoose.Schema({
    service: {
        type: Array,
        
    },
    serviceId: {
        type: String,
         default: () => randomId()
    },
    userId: {
        type: String,
        default: ""

    },
    isActive: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
const Service = mongoose.model("Service", serviceSchema)
module.exports = Service