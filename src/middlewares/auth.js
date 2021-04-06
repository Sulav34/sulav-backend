const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access.', 401),
    );
  }

  // Verfication token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists after token expires or deleted
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist.', 401),
    );
  }

  req.user = currentUser;
  next();
});

// restrictTo('admin') only admin can access this function  -- product delete
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user.role); // role = 'user'
    // roles ['admin']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 401),
      );
    }
    next();
  };
};
