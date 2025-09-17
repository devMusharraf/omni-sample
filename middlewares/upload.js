const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  fileName: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file, originalname));
  },
});

const upload = multer ({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype  !== "text/csv") {
            return cb (new Error ("Only csv are allowed"), false)
        }
        cb(null, true)
    },
})

module.exports = upload
