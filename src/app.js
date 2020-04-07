const express = require('express');
const app = express();
require('../db/mongoose')
const User = require('../model/users')
const multer = require('multer');
const path = require('path')
const postsRouter = require('../routers/posts')

const upload = multer()


app.use(express.json())
const port = process.env.PORT

app.use(express.static(path.join(__dirname, '../front/build')));
app.use(postsRouter)





app.post('/users', async (req, res) => {
    const user = new User({ username: req.body.username, email: req.body.email, password: req.body.password })
    console.log(req.body, user)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        throw new Error(e)
    }
})

app.post('/login', async (req, res) => {
    console.log(req.body.email)
    const user = await User.findOne({ email: req.body.email })
    // console.log(user);

    try {
        if (!user) {
            return res.status(404).send('Error: Please provide valid properties.')
        }
        if (user.password === req.body.password) {
            // console.log("from aboce", user.avatar.toString('base64'))
            const noOfPosts = (await user.populate('posts').execPopulate())
            console.log(noOfPosts.posts.length)
            const updatedUser = {
                username: user.username,
                email: user.email,
                _id: user._id,
                avatar: user.avatar.toString('base64'),
                noOfPosts: noOfPosts.posts.length,
                bio: user.bio,
            }
            // user.avatar.toString('base64')
            // console.log(user)
            return res.status(200).send(updatedUser)
        } else {
            throw new Error('Please Enter Right Email or Password')
        }
    } catch (e) {
        res.status(404).send(e)
    }


})
app.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    try {
        if (!user) {
            return res.status(404).send("Couldn't Find User")
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e)
    }
})

app.patch('/update/:id', async (req, res) => {
    // const optionsArray = ['username', 'email', 'password'];
    const reqParams = Object.keys(req.body)
    const propertyValue = reqParams[0];
    // const updateArray = reqParams.every((prop) => {
    //     return prop !== 
    // })
    console.log(reqParams, propertyValue, req.params.id);

    const user = await User.findByIdAndUpdate(req.params.id, { [propertyValue]: req.body[propertyValue] }, { new: true })
    try {
        if (!user) {
            return res.status(404).send('Couldn\'t find user');
        }
        console.log(user)
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/uploads/:id', upload.single('avatar'), async (req, res) => {
    // console.log(req.file)
    const user = await User.findByIdAndUpdate(req.params.id, { avatar: req.file.buffer }, { new: true })
    try {
        if (!user) {
            return res.send('Couldnt find user')
        }
        // console.log(user.avatar.toString('base64'))
        res.send(user.avatar.toString('base64'))
    } catch (error) {
        res.send(error)
    }
})

app.get('/posts/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })
    try {
        if (!user) {
            return res.status(404).send("No User Found")
        }
        // await user.populate('posts').execPopulate()
        await user.populate({ path: 'posts', select: 'post' }).execPopulate()
        const updatedPosts = user.posts.map((single) => {
            return single.post.toString('base64')
        })
        res.status(200).send(updatedPosts)
        // res.status(200).send(user.posts)
    } catch (error) {
        throw new Error(error)
    }

})
app.get('/otherUserProfile/:username', async (req, res) => {

    const user = await User.findOne({ username: req.params.username })

    try {
        if (!user) {
            return res.status(404).send('Couldn\'t find such user.')
        }
        // Reason avatar does'nt require is becoz avatar model
        // has a buffer property so it stores buffer
        //Meanwhile posts is a virtual property hence populating
        //returns array of buffers meaning individul array 
        // member is basically one pic like avatar so we convert it
        // to tostring using map and send updated posts
        const noOfPosts = await user.populate('posts').execPopulate()
        const updatedPosts = noOfPosts.posts.map((single) => {
            return single.post.toString('base64')
        })



        // console.log(noOfPosts.posts)
        // console.log(user)
        const updatedUser = {
            username: user.username,
            avatar: user.avatar ? user.avatar.toString('base64') : '',
            noOfPosts: updatedPosts.length,
            bio: user.bio,
            posts: updatedPosts
        }

        console.log(updatedUser)
        return res.status(200).send(updatedUser)

    } catch (e) {
        res.status(404).send(e)
    }


})
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/build/index.html'));
});

app.listen(port, () => { console.log(`Listening on port ${port}`)
})
