const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const serviceRoutes = require("./routes/serviceRoutes")
const balanceRoutes = require("./routes/balanceRoutes")
const templateRoutes = require("./routes/templateRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const indexRoutes = require("./routes/indexRoutes")
const main = require("./utils/redis")
app.use(express.json())


app.use("/", userRoutes)
app.use("/", serviceRoutes)
app.use("/", balanceRoutes)
app.use("/", templateRoutes)
app.use("/", uploadRoutes)
app.use("/", indexRoutes)
const PORT = 6000;
connectDB();
main


app.listen(PORT, () => {
    console.log("Server is running")
})

