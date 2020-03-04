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

app.listen(8000, () => { console.log('Listening on port 8000') })
