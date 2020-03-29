const mongoose = require('mongoose');
const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    avatar: {
        type: Buffer
    },
    bio: {
        type: String,
        default: "Add You Description",
        maxlength: 130
    }
    // uploads: [{ type: Schema.Types.ObjectId, ref: 'posts' }]

})

userSchema.virtual('posts', {
    ref: "posts",
    localField: '_id',
    foreignField: 'uploader'
})
const User = mongoose.model('user', userSchema)

module.exports = User