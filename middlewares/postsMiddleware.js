const User = require('../model/users')

const postsMiddleware = async (req, res, next) => {
    try {
        
    } catch (error) {
        res.status(500).send('Unable To Find Posts Of This User')
    }
}