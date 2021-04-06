const Category = require('../models/childCategoryModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/advancedFiltering');

exports.createProduct = catchAsync(async (req, res, next) => {
  const createdBy = req.user.id;
  const product = await await Product.create({ ...req.body, createdBy });

  res.status(201).json({ product });
});

exports.productList = catchAsync(async (req, res, next) => {
  const productsList = await Product.find()
    .populate('category')
    .populate('subCategory')
    .populate('brand')
    .populate('createdBy');

  res.status(200).json({ length: productsList.length, productsList });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const editProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!editProduct) {
    return next(
      new AppError(`Product with that ${req.params.id} not found`, 404)
    );
  }

  res.status(201).json({
    status: 'success',
    editProduct,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getProductByID = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category')
    .populate('subCategory')
    .populate('brand')
    .populate('createdBy');

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({ product });
});

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    }).populate('brand');

    res.json(products);
  } catch (err) {
    console.log();
  }
};

// search products

exports.searchProducts = catchAsync(async (req, res, next) => {
  const pageSize = 2; // will have only 2 products
  const page = Number(req.query.pageNumber) || 1;

  // keyword search
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  // filtering with prices
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  // Pagination
  const count = await Product.countDocuments({ ...keyword }).countDocuments(
    findArgs
  );

  const skip = pageSize * (page - 1);

  // console.log(req.body.filters);

  if (req.query.keyword || req.body.filters) {
    const productsList = await Product.find({ ...keyword })
      .find(findArgs)
      .populate('brand')
      .populate('createdBy')
      .limit(pageSize)
      .skip(skip);

    res.status(200).json({
      length: productsList.length,
      productsList,
      page, // page number
      pages: Math.ceil(count / pageSize), //total pages
      count,
    });
  } else {
    return next(new AppError('Not found', 500));
  }
});

exports.listBySearch = catchAsync(async (req, res, next) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  const products = await Product.find(findArgs).populate('brand');
  // .sort([sortBy, order])
  // .skip(skip)
  // .limit(limit);

  res.status(200).json({ products });
});
