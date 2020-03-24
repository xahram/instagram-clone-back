const mongoose = require('mongoose');
const Schema = mongoose.Schema
const postsSchema = new Schema({
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
    },
    uploader: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }
})


const Posts = mongoose.model("posts", postsSchema)
module.exports = Posts