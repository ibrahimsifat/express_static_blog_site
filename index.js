const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
// file upload schema
const BlogPost = require("./models/BlogPost");
//image upload
const fileUpload = require("express-fileupload");
app.use(fileUpload());

//connecting mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });

// setting template engine
//use static file
app.set("view engine", "ejs");
app.use(express.static("public"));

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes

//setting routers
app.get("/", async (req, res) => {
  const blogposts = await BlogPost.find({});
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

//post a post
app.post("/posts/store", async (req, res) => {
  await BlogPost.create(req.body);
  res.redirect("/");
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
