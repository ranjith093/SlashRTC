const express = require('express')

const cookieSession = require("cookie-session")

const passport = require("passport")

const cors = require('cors');
const authRoutes = require("./routes/authRoutes")
const users = require('./routes/users')
// const authRoutes = require('./routes/authRoutes')
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error")
const connectDb = require('./config/db')

const morgan = require('morgan')
require("./services/passport")
require("./services/passportGithub")
const app  = express();

dotenv.config({path: './config/config.env'})

connectDb()

app.use(express.json())

app.set('view engine', 'ejs')

app.use(cookieSession({
  maxAge:30*24*60*1000,
  keys: [process.env.COOKIE_KEY]
}))

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  app.use(cors())

app.use('/api/v1/users',users)
app.use('/api/v1/auth', authRoutes)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

