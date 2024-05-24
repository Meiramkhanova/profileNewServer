const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Blog = require("../../models/Blog");

// Multer setup for storing images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store images in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to include timestamp to ensure uniqueness
  },
});

const upload = multer({ storage: storage });

// @route   GET api/books/test
// @desc    Tests books route
// @access  Public
router.get("/test", (req, res) => res.send("blogs route testing"));

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get("/", (req, res) => {
  Blog.find()
    .then((blogs) => res.json(blogs))
    .catch((error) => res.status(404).json({ noblogsfound: "No blogs found" }));
});

// @route   GET api/books/:id
// @desc    Get single book by id
// @access  Public
router.get("/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((blog) => res.json(blog))
    .catch((err) => res.status(404).json({ noblogsfound: "No blog found" }));
});

// @route   POST api/books
// @desc    Add/save book
// @access  Public
// POST route for adding a new blog post with an image
router.post("/", upload.single("imageUrl"), (req, res) => {
  const newBlog = new Blog({
    title: req.body.title,
    imageUrl: `/uploads/${req.file.filename}`, // Ensure forward slashes
    description: req.body.description,
  });

  newBlog
    .save()
    .then((blog) => res.json(blog))
    .catch((error) => res.status(400).json({ error: error.message }));
});

// @route   PUT api/books/:id
// @desc    Update book by id
// @access  Public
router.put("/:id", upload.single("imageUrl"), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, date, description, imageUrl }, // Removed 'category' as it was not destructured
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.json({ msg: "Blog post updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @route   DELETE api/books/:id
// @desc    Delete book by id
// @access  Public
router.delete("/:id", (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then((blog) => res.json({ msg: "Blog entry deleted succesfully" }))
    .catch((eror) => res.status(404).json({ error: "No such a blog post" }));
});

module.exports = router;
