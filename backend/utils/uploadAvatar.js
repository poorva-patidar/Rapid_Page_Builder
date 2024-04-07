const multer = require("multer");

const storage = multer.diskStorage({
  destination: `./avatars/`,

  filename: function (req, file, callBack) {
    callBack(null, `${req.body.email}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

module.exports = upload;
