const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const User = require("./models/User");
app.use(express.json());
// session setting
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: "keyboard cat",
  })
);
// session middleware
const authMiddleware = require("./middleware/authMiddleware");
// file upload schema
const BlogPost = require("./models/BlogPost");
//image upload
const fileUpload = require("express-fileupload");
app.use(fileUpload());

//connecting mongodb
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/my_database", { useNewUrlParser: true })
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => console.log(err));
// setting template engine
//use static file
app.set("view engine", "ejs");
app.use(express.static("public"));

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//file upload validation middleware
const validateMiddleWare = (req, res, next) => {
  if (req.files == null || req.body.title == null || req.body.title == null) {
    return res.redirect("/posts/new");
  }
  next();
};
app.use("/posts/store", validateMiddleWare);
//routes

//setting routers
app.get("/", async (req, res) => {
  const blogposts = await BlogPost.find({});
  console.log(req.session);
  res.render("index", {
    blogposts,
  });
});
app.get("/", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "pages/index.html"));
  console.log(req.params.id);
  res.render("index");
});
app.get("/about", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "pages/about.html"));
  res.render("about");
});
app.get("/contact", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "pages/contact.html"));
  res.render("contact");
});
app.get("/post", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "pages/post.html"));
  res.render("post");
});
app.get("/posts/new", (req, res) => {
  res.render("create");
});
// post nre post
app.post("/posts/store", authMiddleware, (req, res) => {
  let image = req.files.image;
  image.mv(path.resolve(__dirname, "public/img", image.name), async (error) => {
    await BlogPost.create({
      ...req.body,
      image: "/img/" + image.name,
    });
    res.redirect("/");
  });
});

// create a user by registration
app.post("/users/register", (req, res) => {
  User.create(req.body, (error, user) => {
    if (error) {
      return res.redirect("/auth/register");
    }

    res.redirect("/");
  });
});
//user registration
app.get("/auth/register", (req, res) => {
  res.render("register"); // render register.ejs
});
// login user
app.get("/auth/login", (req, res) => {
  res.render("login");
});
app.get("/auth/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }, (error, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          req.session.userId = user._id;
          // if passwords match
          // store user session, will talk about it later
          res.redirect("/");
        } else {
          res.redirect("/auth/login");
        }
      });
    } else {
      res.redirect("/auth/login");
    }
  });
});
// find post
app.get("/post/:id", async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  res.render("post", {
    blogpost,
  });
});

app.listen(3000, () => {
  console.log(`listing port 3000`);
});
