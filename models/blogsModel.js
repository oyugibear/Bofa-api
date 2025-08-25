const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String,
    },
    reading_time: {
        required: true,
        type: String,
    },
    picture: {
        required: true,
        type: Object,
    },
    blog_text: {
        required: true,
        type: String,
    },
    author: {
        required: true,
        type: String,
    },
    about_author: {
        type: String,
    },
    publisher: {
        required: true,
        type: String,
    },
    publisher_link: {
        type: String,
    },
    category: {
        type: String,
    },

    status: {
        type: String,
        default: "Inactive"
    },

    postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
},
{ timestamps: true }
)

module.exports = mongoose.model('Blogs', blogsSchema)