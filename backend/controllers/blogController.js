const Blog = require('../models/Blog');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// Helper to create URL slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now();
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const count = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      blogs,
      page: Number(page),
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by slug or ID
// @route   GET /api/blogs/:identifier
// @access  Public
const getBlogByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let blog;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(identifier);
    } else {
      blog = await Blog.findOne({ slug: identifier });
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found' });
    }

    // Increment views counter
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  try {
    const { title, content, category, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: 'magranchal_blogs',
        resource_type: 'image'
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const slug = createSlug(title);

    const blog = await Blog.create({
      title,
      slug,
      content,
      category: category || 'Local News',
      imageUrl,
      imagePublicId,
      author: author || req.user.name || 'Magranchal Khoj Khabar'
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update existing blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, author } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (title && title !== blog.title) {
      blog.title = title;
      blog.slug = createSlug(title);
    }

    if (content) blog.content = content;
    if (category) blog.category = category;
    if (author) blog.author = author;

    if (req.file) {
      // Delete old image if it exists
      if (blog.imagePublicId) {
        await deleteFromCloudinary(blog.imagePublicId, 'image');
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: 'magranchal_blogs',
        resource_type: 'image'
      });
      blog.imageUrl = uploadResult.secure_url;
      blog.imagePublicId = uploadResult.public_id;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blog.imagePublicId) {
      await deleteFromCloudinary(blog.imagePublicId, 'image');
    }

    await blog.deleteOne();
    res.json({ message: 'Blog article successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogByIdentifier,
  createBlog,
  updateBlog,
  deleteBlog
};
