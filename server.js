if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
const connectDB = require('./connectDB')

const User = require('./models/User')

// passport config
initializePassport(passport)

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'))
// static file
app.use(express.static(path.join(__dirname, "public")));
// set ejs engine and ejs layout
// app.use(expressLayouts);
// app.set("layout", "./partials/layout");
app.set("view engine", "ejs");
// flash config
app.use(flash())
// session config
app.use(session({
  secret: "secret_key",
  resave: false,
  saveUninitialized: false
}))
// override query with _method
app.use(methodOverride('_method'))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect DB
connectDB()

// routes
app.get('/', (req, res) => {
  res.render('index.ejs', { user: req.user ? req.user : undefined })
})

app.get('/auth', checkNotAuthenticated, (req, res) => {
  res.render('auth.ejs', { user: req.user ? req.user : undefined })
})

app.post('/auth/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs', { user: req.user ? req.user : undefined })
})

app.get('/auth/register', checkNotAuthenticated, async (req, res) => {
  try {
    console.log(req.body)
    const hashedPassword = await bcrypt.hash("1234", 10)

    // users.push({
    //   id: Date.now().toString(),
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: hashedPassword
    // })
    // res.redirect('/auth')
    try {
      const newUser = new User({
        name: "test1",
        email: "123456khj001@gmail.com",
        phone: "0968585685",
        password: hashedPassword,
        address: {
          ward: "Nho",
          street: "Phuong Canh"
        }
      })
      await newUser.save()
    } catch (err) {
      console.log(err)
    }
    res.redirect('/auth')
  } catch {
    res.redirect('/auth')
  }
})

app.get('/recipes', (req, res) => {
  res.render('recipe', { user: req.user ? req.user : undefined })
})

app.get('/about', checkAuthenticated, (req, res) => {
  res.render('about', { user: req.user ? req.user : undefined })
})

app.get('/blog', (req, res) => {
  res.render('blog', { user: req.user ? req.user : undefined })
})

app.get('/contact', (req, res) => {
  res.render('contact', { user: req.user ? req.user : undefined })
})


app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/auth')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/auth')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server is running or port ${port}`) )