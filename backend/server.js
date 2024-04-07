const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const ejs = require("ejs");

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;

mongoose.connect(process.env.CONN_STR).then(() => {
  console.log("Connection established successfully");
});

const userController = require("./controllers/userController");
const pageController = require("./controllers/pageController");
const uploadFile = require("./utils/uploadFile");
const uploadAvatar = require("./utils/uploadAvatar");

const app = express();
// require("./utils/startCron.js");
require("./utils/setupCronJob");

app.use(cors());
app.set("view engine", "ejs");
app.use(express.json());

app.use(express.static("public"));
app.use(express.static("public/html"));

app.post(
  "/signup",
  uploadAvatar.single("avatar"),
  userController.verify,
  userController.addUser
);

app.post("/login", userController.loginUser);

app.get('/publishedpages', pageController.getPublishedPages);

app.post(
  "/addPage",
  userController.protect,
  uploadFile.single("attachment"),
  pageController.addPage
);

app.get("/pages", userController.protect, pageController.getPages);

app.get("/mypages", userController.protect, pageController.getMyPages);

app.get("/page/:id", userController.protect, pageController.getPage);

app.post(
  "/draftPage",
  userController.protect,
  uploadFile.single("attachment"),
  pageController.draftPage
);

app.get("/file", userController.protect, (req, res) => {
  const filepath = req.user.avatar.split("/");
  const fileName = filepath[filepath.length - 1];

  if(fileName === ""){
    return res.status(404).json({
      status: "failed",
      message: "Avatar not found",
    });
  } else {
    res.sendFile(fileName, {
      root: path.join(__dirname, "avatars"),
    });
  }
});

app.delete(
  "/deletePage/:id",
  userController.protect,
  pageController.deletePage
);

app.patch(
  "/updatePage/:id",
  userController.protect,
  uploadFile.single("attachment"),
  pageController.updatePage
);

app.get("/getattachment/uploads/:fileName", (req, res) => {
  const fileName = req.params.fileName;

  res.sendFile(fileName, {
    root: path.join(__dirname, "uploads"),
  });
});

app.get("/download/uploads/:fileName", (req, res) => {
  const fileName = req.params.fileName;

  res.download(path.join(__dirname, "uploads", fileName));
});

app.get("/blog/*", pageController.showPage);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
