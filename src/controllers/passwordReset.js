const sendEmail = require('../utils/sendEmail');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.forgotPassword = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const token = user.getResetPasswordToken();
    // console.log(token);

    const link = `${req.protocol}://${req.host}/api/users/resetPassword/${token}`;

    await sendEmail(
      email,
      'noreply@test.com',
      'Password reset token',
      `
        <div>Click the link below to reset your password</div><br/>
        <div>${link}</div>
      `,
    );
    return res.status(200).json({
      message: 'Password reset link has been successfully sent to your inbox',
    });
  } catch (error) {
    console.log(error);
    return next(new AppError('Email not sent', 500));
  }
});
