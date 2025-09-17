const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
const templateRoutes = require("./routes/templateRoutes");
// const uploadRoutes = require("./routes/uploadRoutes")
const indexRoutes = require("./routes/indexRoutes");
const rateLimiter = require("./middlewares/rateLimiter");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(rateLimiter);
connectDB();
const PORT = 6000;
app.use("/", userRoutes);
app.use("/", serviceRoutes);
app.use("/", balanceRoutes);
app.use("/", templateRoutes);
// app.use("/", uploadRoutes)
app.use("/", indexRoutes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Define the upload route
app.post("/upload-csv", upload.single("csvFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // Process the parsed CSV data (e.g., insert numbers into a database)
      console.log("Parsed CSV data:", results);
      // Example: Assuming your CSV has a column named 'number'
      const numbers = results
        .map((row) => parseInt(row.number, 10))
        .filter((n) => !isNaN(n));
      console.log("Extracted numbers:", numbers);

      res.status(200).send({
        message: "CSV file uploaded and parsed successfully!",
        data: results,
        extractedNumbers: numbers,
      });
    })
    .on("error", (error) => {
      console.error("Error parsing CSV:", error);
      res.status(500).send("Error processing CSV file.");
    });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
