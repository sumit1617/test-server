const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../model/user");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");
const userInfo = require("../utils/userInfo");
const {
  loginBody,
  registerBody,
  roleBody,
  profileBody,
} = require("../utils/userBody");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const register = registerBody(req.body);
  const { name, email, password } = register;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const login = loginBody(req.body);

  const { email, password } = login;

  // check if user has given email & password both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter userEmail & userPassword", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const formattedUser = userInfo(user);

  res.status(200).json({
    success: true,
    user: formattedUser,
  });
});

// Get All User's Details -- Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  // Map the users to the new format
  const formattedUsers = users.map((user) => userInfo(user));

  res.status(200).json({
    success: true,
    users: formattedUsers,
  });
});

// Get Single User -- Admin
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("Invalid Id", 401));
  }

  const formattedUser = userInfo(user);

  res.status(200).json({
    success: true,
    user: formattedUser,
  });
});

// Update User Role -- Admin
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  const newRole = roleBody(req.body);
  const user = req.params.id;

  await User.findByIdAndUpdate(user, newRole, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User Does not exist with Id: ${req.params.id}`, 400)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// Update user Profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = profileBody(req.body);

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Update User Password
exports.updatePassoword = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user.id);

  console.log(req.body);
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});
