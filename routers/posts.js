const express = require('express')
const postsRouter = new express.Router()
const multer = require('multer');
const Posts = require('../model/posts')

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

postsRouter.post('/post/upload', upload.single('post'), async (req, res) => {
    const post = new Posts({ post: req.file.buffer })
    try {
        await post.save()
        res.status(200).send(post)
    } catch (e) {
        res.status(500).send(e)
    }


})

module.exports = postsRouter