const Router = require('express').Router

const authRouter = new Router()

authRouter.get('/login', function (req, res) {
  res.send('<h1>LOGIN</h1>')
})

authRouter.post('/login')

authRouter.get('/register')
authRouter.post('/register')

module.exports = authRouter
