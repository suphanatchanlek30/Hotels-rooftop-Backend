const mongoose = require('mongoose');

// test update git

// TODO: Modify this after user created
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    content: {
        type: Object,
        required: true
    },
    coverImg: String,
    category: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: Number,
    createdAt: {
    type: Date,
    default: Date.now
    }
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;