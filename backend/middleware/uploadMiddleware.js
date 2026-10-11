const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure local uploads directory exists for fallback local file storage
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk storage for local fallback
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Memory storage for direct streaming to Cloudinary
const memoryStorage = multer.memoryStorage();

// File filter for images & pdfs
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|gif/;
  const allowedPdfTypes = /pdf/;

  const extName = path.extname(file.originalname).toLowerCase();
  const isImage = allowedImageTypes.test(extName) || allowedImageTypes.test(file.mimetype);
  const isPdf = allowedPdfTypes.test(extName) || allowedPdfTypes.test(file.mimetype);

  if (isImage || isPdf) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, WEBP, GIF) and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max limit for newspapers
  fileFilter: fileFilter
});

module.exports = upload;
