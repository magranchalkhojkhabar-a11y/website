const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogByIdentifier,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getBlogs);
router.get('/:identifier', getBlogByIdentifier);

// Admin operations
router.post('/', protect, adminOnly, upload.single('image'), createBlog);
router.put('/:id', protect, adminOnly, upload.single('image'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
