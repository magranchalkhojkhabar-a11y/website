const mongoose = require('mongoose');

const newspaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Newspaper edition title is required'],
      trim: true
    },
    editionDate: {
      type: String,
      required: [true, 'Edition date is required']
    },
    pdfUrl: {
      type: String,
      required: [true, 'PDF file URL is required']
    },
    pdfPublicId: {
      type: String,
      default: ''
    },
    thumbnailUrl: {
      type: String,
      default: ''
    },
    fileSize: {
      type: String,
      default: 'Unknown'
    },
    downloadsCount: {
      type: Number,
      default: 0
    },
    // Auto-delete after 30 days (2592000 seconds) using MongoDB TTL index
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Newspaper', newspaperSchema);
