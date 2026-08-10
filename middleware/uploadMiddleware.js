const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =Date.now() + "-" + file.originalname ;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedType = /jpeg|jpg|png/;
    
    const extName = allowedType.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedType.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    }
    else {
        cb(new Error("Haya file JPG,JPEG dan PNG yang diperbolehkan"));
    }
};

