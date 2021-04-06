const express = require('express');
const {
  createCategory,
  createSubCategory,
  categoryList,
  subCategoryList,
  childCategoryList,
  createChildCategory,
  updateCategory,
  deleteCategory,
  updateSubCategory,
  deleteSubCategory,
  updateChildCategory,
  deleteChildCategory,
  getSubCatUnderMainCat,
  getChildCatUnderSubCat,
  getCategoryById,
  getSubCategoryById,
  getChildCategoryById,
} = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

////////////////////////////////////////////////////////////////////
// Category Route
router.post(
  '/main/create',
  protect,
  restrictTo('admin', 'seller'),
  createCategory,
);
router.get('/main/list', categoryList);
router.patch(
  '/main/:id',
  protect,
  restrictTo('admin', 'seller'),
  updateCategory,
);
router.delete(
  '/main/:id',
  protect,
  restrictTo('admin', 'seller'),
  deleteCategory,
);
router.get(
  '/main/:id',
  protect,
  restrictTo('admin', 'seller'),
  getCategoryById,
);

/////////////////////////////////////////////
// Sub-category
router.post(
  '/subcategory/create',
  protect,
  restrictTo('admin', 'seller'),
  createSubCategory,
);
router.get('/subcategory/list', subCategoryList);
router.patch(
  '/subcategory/:id',
  protect,
  restrictTo('admin', 'seller'),
  updateSubCategory,
);
router.delete(
  '/subcategory/:id',
  protect,
  restrictTo('admin', 'seller'),
  deleteSubCategory,
);
router.get('/subcategory/:id', getSubCategoryById);

/////////////////////////////////////////////////////////
// Child-category
router.post(
  '/childcategory/create',
  protect,
  restrictTo('admin', 'seller'),
  createChildCategory,
);
router.get('/childcategory/list', childCategoryList);
router.patch(
  '/childcategory/:id',
  protect,
  restrictTo('admin', 'seller'),
  updateChildCategory,
);
router.delete(
  '/childcategory/:id',
  protect,
  restrictTo('admin', 'seller'),
  deleteChildCategory,
);
router.get('/childcategory/:id', getChildCategoryById);

// Get all the sub-category with that main category id
router.get('/subs/:id', getSubCatUnderMainCat);

router.get('/childSub/:id', getChildCatUnderSubCat);

module.exports = router;
