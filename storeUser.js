const User = require("./models/User");
const path = require("path");
module.exports = (req, res) => {
  User.create(req.body, async (error, user) => {
    console.log(req.body);
    res.redirect("/");
  });
};
