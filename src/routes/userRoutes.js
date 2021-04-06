const express = require('express');
const {
  signup,
  login,
  logout,
  updatePassword,
} = require('../controllers/authController');
const { forgotPassword } = require('../controllers/passwordReset');
const {
  deleteMe,
  getMe,
  updateMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');
const {
  deleteOneUser,
  updateOneUser,
  getAllUsers,
  createUser,
} = require('../controllers/adminController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// Password Reset - Not working
router.post('/forgot-password', forgotPassword);

// Admin
router.route('/').get(protect, restrictTo('admin'), getAllUsers);
router
  .route('/:id')
  .delete(protect, restrictTo('admin'), deleteOneUser)
  .patch(protect, restrictTo('admin'), updateOneUser);
router.post('/createUser', protect, restrictTo('admin'), createUser);

// Active users can only access this route
router.get('/me/:id', protect, getMe);
router.delete('/deleteMe', protect, deleteMe);
router.put('/update', protect, updateMe);
router.put('/updateMyPassword', protect, updatePassword);

module.exports = router;
