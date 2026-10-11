const Newspaper = require('../models/Newspaper');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// Helper to format file size
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// @desc    Get all newspapers (e-papers)
// @route   GET /api/newspapers
// @access  Public
const getNewspapers = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const count = await Newspaper.countDocuments();
    const newspapers = await Newspaper.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      newspapers,
      page: Number(page),
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get latest newspaper issue
// @route   GET /api/newspapers/latest
// @access  Public
const getLatestNewspaper = async (req, res) => {
  try {
    const newspaper = await Newspaper.findOne().sort({ createdAt: -1 });
    if (!newspaper) {
      return res.status(404).json({ message: 'No e-paper issues available' });
    }
    res.json(newspaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single newspaper details
// @route   GET /api/newspapers/:id
// @access  Public
const getNewspaperById = async (req, res) => {
  try {
    const newspaper = await Newspaper.findById(req.params.id);
    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper edition not found' });
    }
    res.json(newspaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track download count for newspaper
// @route   POST /api/newspapers/:id/download
// @access  Public
const trackDownload = async (req, res) => {
  try {
    const newspaper = await Newspaper.findById(req.params.id);
    if (newspaper) {
      newspaper.downloadsCount = (newspaper.downloadsCount || 0) + 1;
      await newspaper.save();
      return res.json({ downloadUrl: newspaper.pdfUrl, downloadsCount: newspaper.downloadsCount });
    }
    res.status(404).json({ message: 'Newspaper not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/Upload new newspaper PDF (Admin)
// @route   POST /api/newspapers
// @access  Private/Admin
const createNewspaper = async (req, res) => {
  try {
    const { title, editionDate } = req.body;

    if (!title || !editionDate) {
      return res.status(400).json({ message: 'Title and edition date are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a newspaper PDF file' });
    }

    // Upload PDF to Cloudinary as raw resource or auto
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: 'magranchal_newspapers',
      resource_type: 'raw',
      format: 'pdf'
    });

    const fileSizeStr = formatBytes(req.file.size);

    const newspaper = await Newspaper.create({
      title,
      editionDate,
      pdfUrl: uploadResult.secure_url,
      pdfPublicId: uploadResult.public_id,
      fileSize: fileSizeStr
    });

    res.status(201).json(newspaper);
  } catch (error) {
    console.error('Create Newspaper Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update newspaper details (Admin)
// @route   PUT /api/newspapers/:id
// @access  Private/Admin
const updateNewspaper = async (req, res) => {
  try {
    const { title, editionDate } = req.body;
    const newspaper = await Newspaper.findById(req.params.id);

    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper issue not found' });
    }

    if (title) newspaper.title = title;
    if (editionDate) newspaper.editionDate = editionDate;

    if (req.file) {
      // Delete old PDF if uploaded
      if (newspaper.pdfPublicId) {
        await deleteFromCloudinary(newspaper.pdfPublicId, 'raw');
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: 'magranchal_newspapers',
        resource_type: 'raw',
        format: 'pdf'
      });

      newspaper.pdfUrl = uploadResult.secure_url;
      newspaper.pdfPublicId = uploadResult.public_id;
      newspaper.fileSize = formatBytes(req.file.size);
    }

    const updatedNewspaper = await newspaper.save();
    res.json(updatedNewspaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete newspaper issue (Admin)
// @route   DELETE /api/newspapers/:id
// @access  Private/Admin
const deleteNewspaper = async (req, res) => {
  try {
    const newspaper = await Newspaper.findById(req.params.id);
    if (!newspaper) {
      return res.status(404).json({ message: 'Newspaper issue not found' });
    }

    if (newspaper.pdfPublicId) {
      await deleteFromCloudinary(newspaper.pdfPublicId, 'raw');
    }

    await newspaper.deleteOne();
    res.json({ message: 'Newspaper edition successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNewspapers,
  getLatestNewspaper,
  getNewspaperById,
  trackDownload,
  createNewspaper,
  updateNewspaper,
  deleteNewspaper
};
