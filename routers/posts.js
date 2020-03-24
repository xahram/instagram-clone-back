const express = require('express')
const postsRouter = new express.Router()
const multer = require('multer');
const Posts = require('../model/posts')
const User = require('../model/users')

const upload = multer({
    limits: {
        fileSize: 3000000
    },
    fileFilter: (req, file, cb) => {

        if (!file.originalname.match(/\.(jpg|png)$/)) {
            return cb(new Error("Please Upload Image File Either JPG or Png"))
        }
        cb(undefined, true)

    }
})

postsRouter.post('/post/upload/:id', upload.single('post'), async (req, res) => {
    const user = await User.findById(req.params.id)
    try {
        if (!user) {
            return res.status(200).send('Couldn\'t find user\'s posts')
        }
        //"5e67ccfc4199cb88bcc06e6b"
        // console.log(req.file.buffer)
        // console.log(req.file.buffer.toString("base64"))
        const post = new Posts({ post: req.file.buffer, uploader: user._id })
        try {
            await post.save()
            res.status(200).send(post)
        } catch (e) {
            res.status(500).send(e)
        }
    } catch (error) {
        throw new Error('Coudln\'t find posts related to this user')
    }



})



module.exports = postsRouter