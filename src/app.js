const express = require('express');
const app = express();
require('../db/mongoose')
const User = require('../model/users')

app.use(express.json())

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

    const user = await User.findOne({ email: req.body.email })
    console.log(user);

    try {
        if (!user) {
            return res.status(404).send('Error: Please provide valid properties.')
        }
        if (user.password === req.body.password) {
            return res.status(200).send(user)
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
app.listen(8000, () => { console.log('Listening on port 8000') })
