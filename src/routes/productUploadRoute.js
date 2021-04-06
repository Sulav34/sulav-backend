const path = require('path');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

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

const uploadProductImage = upload.array('images', 20);

const resizeProductPhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.originalname.replace(/\..+$/, '');
      const newFileName = `product-${filename}-${Date.now()}.jpeg`;

      // console.log(newFileName);

      await sharp(file.buffer)
        // .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${newFileName}`);

      req.body.images.push(newFileName);
    }),
  );
  next();
});

const getResult = async (req, res) => {
  if (req.body.images.length <= 0) {
    return res.send(`You must select at least 1 image.`);
  }
  let images = [];

  if (req.body.images.length > 0) {
    images = req.body.images.map((file) => {
      return { img: file };
    });
  }

  return res.send(images);
};

router.post('/products', uploadProductImage, resizeProductPhoto, getResult);

module.exports = router;
