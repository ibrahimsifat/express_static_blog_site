const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");

//connecting mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });

// setting template engine
//use static file
app.set("view engine", "ejs");
app.use(express.static("public"));
//routes

//setting routers
app.get("/", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "pages/index.html"));
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
app.post("/posts/store", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log(`listing port 3000`);
});
