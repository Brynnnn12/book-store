const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { validateUser, validateLogin } = require("../validation/userValidation");

exports.register = asyncHandler(async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ status: false, message: "User  already exists" });
  }

  const user = await User.create({ name, email, password });

  if (!user) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user data" });
  }

  return res.status(201).json({
    status: true,

    message: "User  registered successfully",

    data: {
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  // Validate the incoming request data

  const { error } = validateLogin(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password" });
  }

  return res.status(200).json({
    status: true,

    message: "Login successful",

    data: {
      name: user.name,

      email: user.email,

      role: user.role,

      token: generateToken(user._id),
    },
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    status: true,
    message: "Logout berhasil",
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new Error("User not found");

  return res.status(200).json({
    status: true,
    message: "User profile retrieved",
    data: user,
  });
});
