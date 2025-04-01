const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { validateUser } = require("../validation/userValidation");

exports.register = asyncHandler(async (req, res) => {
  const { error, value } = validateUser(req.body);
  if (error) throw new Error(error.details[0].message);

  const { name, email, password } = value;
  if (await User.findOne({ email })) throw new Error("User already exists");

  const user = await User.create({ name, email, password });
  if (!user) throw new Error("Invalid user data");

  res.status(201).json({
    status: true,
    message: "User registered successfully",
    data: {
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    throw new Error("Invalid email or password");

  res.json({
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

  res.json({
    status: true,
    message: "User profile retrieved",
    data: user,
  });
});
