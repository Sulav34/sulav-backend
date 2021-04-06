const express = require('express');
const {
  createProduct,
  productList,
  updateProduct,
  deleteProduct,
  getProductByID,
  searchProducts,
  listBySearch,
  // filterProducts,
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.post('/create', protect, restrictTo('admin', 'seller'), createProduct);
router.get('/list', productList);
router.patch('/:id', protect, restrictTo('admin', 'seller'), updateProduct);
router.delete('/:id', protect, restrictTo('admin', 'seller'), deleteProduct);
router.get('/:id', getProductByID);

//search
router.post('/', searchProducts);

// Filtering
router.post('/filters', listBySearch);

module.exports = router;
