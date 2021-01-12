if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const initializePassport = require("./passport-config");
const connectDB = require("./connectDB");

const { sendMail } = require("./nodemailer");

const User = require("./models/User");
const Contact = require("./models/Contact");
const Subscribe = require("./models/Subscribe");

// passport config
initializePassport(passport);

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
// static file
app.use(express.static(path.join(__dirname, "public")));
// set ejs engine and ejs layout
// app.use(expressLayouts);
// app.set("layout", "./partials/layout");
app.set("view engine", "ejs");
// flash config
app.use(flash());
// session config
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
// override query with _method
app.use(methodOverride("_method"));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect DB
connectDB();

// routes
app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.user ? req.user : undefined,
  });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs", {
    name: "",
    email: "",
    phone: "",
    password: "",
    ward: "",
    street: "",
    error: "",
    success: "",
  });
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const { name, email, phone, password, ward, street } = req.body;
    let error = "";

    if (!name || !email || !phone || !password || !ward || !street) {
      error = "Please enter all fields";
    }
    if (error) {
      return res.render("register", {
        name: name ? name : "",
        email: email ? email : "",
        phone: phone ? phone : "",
        password: password ? password : "",
        ward: ward ? ward : "",
        street: street ? street : "",
        error: error,
        success: "",
      });
    }

    const hashedPassword = await bcrypt.hash("1234", 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      address: {
        ward,
        street,
      },
    });
    await newUser.save();
    sendMail(
      email,
      "Register Success",
      "Thank you for registering for our website. You can login now.",
      "register-success"
    );
    res.render("register", {
      name: name ? name : "",
      email: email ? email : "",
      phone: phone ? phone : "",
      password: password ? password : "",
      ward: ward ? ward : "",
      street: street ? street : "",
      error: "",
      success: "Register success",
    });
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

app.get("/recipes", (req, res) => {
  res.render("recipe", { user: req.user ? req.user : undefined });
});

app.get("/about", checkAuthenticated, (req, res) => {
  res.render("about", { user: req.user ? req.user : undefined });
});

app.get("/blog", (req, res) => {
  res.render("blog", { user: req.user ? req.user : undefined });
});

app.get("/contact", (req, res) => {
  res.render("contact", { user: req.user ? req.user : undefined });
});

app.post("/contact", async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    const newContact = new Contact({
      name,
      phone,
      email,
      message: message ? message : "",
    });
    await newContact.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const newSubscribe = new Subscribe({
      email,
    });
    await newSubscribe.save();
    sendMail(email, "Subscribe Success", "Hello friend", "new-subscribe");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running or port ${port}`));
