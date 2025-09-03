const multer = require("multer");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) =>  {
        cb(null, file.fieldname + "-" + Date.now() )
    }
})

const upload = multer ({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
            return cb(new Error("please upload a image"))
        }
        cb(undefined, true)
    }
    
})

module.exports = upload