const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file?.path ?? "";
    const newUser = await User.create({
      name, 
      email,
      password,
      avatar
    });

    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });

  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Please provide email and password for login",
    });
  }

  const user = await User.findOne({ email }).select('+password'); // where clause

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({
      status: "failed",
      message: "Incorrect email or password",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
  
  res.status(200).json({
    status: "success",
    token,
    message: "User logged in successfully",
  });
  } catch(err){
    res.status(500).json({
      status: "failed",
      message: err.message,
    })
  }
};

const verify = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password ) {
    return res.status(400).json({
      status: "failed",
      message: "Incomplete user details",
    });
  }

  next();
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(" ")[0] === "Bearer") {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid token. Please login again",
        });
      }

      req.userId = user._id;
      req.user = user;
      next();
    } catch (error) {
      return res.status(403).json({
        status: "failed",
        message: error.message,
      });
    }
  } else {
    return res.status(403).json({
      status: "failed",
      message: "User not authorized. Please log in",
    });
  }
};


module.exports = { addUser, loginUser, verify, protect,};
