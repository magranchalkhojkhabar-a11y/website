const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    category: {
      type: String,
      default: 'Local News',
      trim: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: 'Magranchal Khoj Khabar Team'
    },
    views: {
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

// Explicit TTL index definition
blogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('Blog', blogSchema);
