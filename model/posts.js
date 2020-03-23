const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    post: {
        type: Buffer,
    },
    likes: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        default: ''
    }
})


const Posts = mongoose.model("posts", postsSchema)
module.exports = Posts