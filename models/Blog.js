const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  date: {
    type: Date,
  },
  description: {
    type: String,
  },
});

module.exports = Blog = mongoose.model("blog", BlogSchema);
