const express = require('express');

const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');
const Childcategory = require('../models/childCategoryModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

///////////////////////////////////////////////////////////////////////
// Category
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({ category });
});

exports.categoryList = catchAsync(async (req, res, next) => {
  const categoriesList = await Category.find();

  res.status(200).json({ length: categoriesList.length, categoriesList });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const editCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!editCategory) {
    return next(
      new AppError(`Category with that ${req.params.id} not found`, 404),
    );
  }

  res.status(201).json({
    status: 'success',
    editCategory,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.status(200).json(category);
});

///////////////////////////////////////////////////////////////////////////
//Sub-category
exports.createSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await Subcategory.create(req.body);

  res.status(201).json({ subCategory });
});

exports.subCategoryList = catchAsync(async (req, res, next) => {
  const subCategoriesList = await Subcategory.find().populate('categoryID');

  res.status(200).json({ subCategoriesList });
});

exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const editSubCategory = await Subcategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!editSubCategory) {
    return next(
      new AppError(`Sub-Category with that ${req.params.id} not found`, 404),
    );
  }

  res.status(201).json({
    status: 'success',
    editSubCategory,
  });
});

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await Subcategory.findByIdAndDelete(req.params.id);

  if (!subCategory) {
    return next(new AppError('No sub-category found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getSubCategoryById = catchAsync(async (req, res, next) => {
  const subCategory = await Subcategory.findById(req.params.id);
  if (!subCategory) {
    return new AppError(
      `Sub Category with that ${req.params.id} not found`,
      404,
    );
  }
  res.status(200).json(subCategory);
});

/////////////////////////////////////////////////////////////////////////////
//Child-category
exports.createChildCategory = catchAsync(async (req, res, next) => {
  const childCategory = await Childcategory.create(req.body);

  res.status(201).json({ childCategory });
});

exports.childCategoryList = catchAsync(async (req, res, next) => {
  const childCategoriesList = await Childcategory.find()
    .populate('categoryID')
    .populate('subCategoryID');

  res.status(200).json({ childCategoriesList });
});

exports.updateChildCategory = catchAsync(async (req, res, next) => {
  const editChildCategory = await Childcategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!editChildCategory) {
    return next(
      new AppError(`Child Category with that ${req.params.id} not found`, 404),
    );
  }

  res.status(201).json({
    status: 'success',
    editChildCategory,
  });
});

exports.deleteChildCategory = catchAsync(async (req, res, next) => {
  const childCategory = await Childcategory.findByIdAndDelete(req.params.id);

  if (!childCategory) {
    return next(new AppError('No child category found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getChildCategoryById = catchAsync(async (req, res, next) => {
  const brand = await Childcategory.findById(req.params.id);
  res.status(200).json(brand);
});

//////////////////////////////////////////////////////////////////////////
exports.getSubCatUnderMainCat = catchAsync(async (req, res, next) => {
  const subCategory = await Subcategory.find({
    categoryID: req.params.id,
  });

  // console.log(subCategory);

  res.status(200).json({ subCategory });
});

exports.getChildCatUnderSubCat = catchAsync(async (req, res, next) => {
  const childCategory = await Childcategory.find({
    subCategoryID: req.params.id,
  });

  res.status(200).json({ childCategory });
});
