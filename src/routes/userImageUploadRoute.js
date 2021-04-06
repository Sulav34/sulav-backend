const path = require('path');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     // user-${req.user._id} will overwrite the current user photo
//     const name = file.originalname.split('.')[0];
//     cb(null, `${name}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
    return next();
  }

  const name = req.file.originalname.split('.')[0];
  req.file.filename = `${name}-${Date.now()}.jpeg`;

  // size - square
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

router.post('/users', uploadUserPhoto, resizeUserPhoto, (req, res) => {
  res.send(`${req.file.filename}`);
});

module.exports = router;
