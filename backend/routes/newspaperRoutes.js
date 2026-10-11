const express = require('express');
const router = express.Router();
const {
  getNewspapers,
  getLatestNewspaper,
  getNewspaperById,
  trackDownload,
  createNewspaper,
  updateNewspaper,
  deleteNewspaper
} = require('../controllers/newspaperController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getNewspapers);
router.get('/latest', getLatestNewspaper);
router.get('/:id', getNewspaperById);
router.post('/:id/download', trackDownload);

// Admin operations
router.post('/', protect, adminOnly, upload.single('pdf'), createNewspaper);
router.put('/:id', protect, adminOnly, upload.single('pdf'), updateNewspaper);
router.delete('/:id', protect, adminOnly, deleteNewspaper);

module.exports = router;
