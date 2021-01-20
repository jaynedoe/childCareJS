const express = require('express')
const bodyParser = require('body-parser')
const appRouter = require('./routers/index')
const authRouter = require('./routers/auth')

const _ = require('lodash')
const calculator = require('./models/calculator')

const app = express()
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('src/public'))

app.use('/auth', authRouter)
app.use('/', appRouter)

//app.listen
app.listen(process.env.PORT || 3000, function () {
  console.log('Server listening on port 3000.  Press Ctrl + C to exit.')
})
