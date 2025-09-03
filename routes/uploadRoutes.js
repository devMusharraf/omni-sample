const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

router.post("/upload",   upload.single("file"), (req, res) => {
res.send(req.file)
},
(error, req, res) => {
    res.status(400).send({ message: error.message})
})

module.exports = router;