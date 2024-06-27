const jwt = require("jsonwebtoken");
const User = require("./../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const userResponse = users.map((user) => ({
      fullName: user.fullName,
      email: user.email,
      _id: user._id,
      created_on: user.created_on,
    }));

    res.status(200).json({
      status: "success",
      length: users.length,
      users: userResponse,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

exports.createAccount = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res
      .status(404)
      .json({ status: "failed", message: "Please enter fullName" });
  }
  if (!email) {
    return res
      .status(404)
      .json({ status: "failed", message: "Please enter valid email" });
  }

  if (!password) {
    return res
      .status(404)
      .json({ status: "failed", message: "Please enter password" });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res
      .status(404)
      .json({ status: "failed", message: "user already exist" });
  }
  const newUser = await User.create({ fullName, email, password });
  newUser.save();

  const accessToken = jwt.sign({ newUser }, process.env.SECRET_KEY, {
    expiresIn: "36000m",
  });
  return res.status(200).json({
    status: "success",
    newUser,
    accessToken,
    message: "user created successfully",
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!password) {
    return res
      .status(404)
      .json({ status: "error", message: "enter your password" });
  }
  if (!email) {
    return res
      .status(404)
      .json({ status: "error", message: "enter valid email" });
  }

  const userInfo = await User.findOne({ email });
  if (!userInfo) {
    return res.status(404).json({ status: "error", message: "user not found" });
  }
  if (userInfo.email === email && userInfo.password === password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.SECRET_KEY, {
      expiresIn: "3600m",
    });

    return res.json({
      status: "success",
      message: "Login successful",
      email,
      accessToken,
    });
  } else {
    return res.json({
      status: "failed",
      message: "Invald credentials",
    });
  }
};
