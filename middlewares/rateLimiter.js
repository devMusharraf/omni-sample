const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 60 * 100,
    max: 3,
    message: 'too many request, please try again later'
})
module.exports = limiter