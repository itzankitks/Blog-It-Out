const express = require("express");
const router = express.Router();
const User = require("../models/user_model");

router.get("/signin", (req, res) => {
  return res.render("signIn_page");
});

router.get("/signup", (req, res) => {
  return res.render("signUp_page");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.matchPassword(email, password);

  return res.redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(email, password);
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;
