const multer = require("multer");

const storage = multer.diskStorage({
  destination: `./uploads/`,

  filename: function (req, file, callBack) {
    callBack(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

module.exports = upload;
