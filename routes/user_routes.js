const express = require("express");
const router = express.Router();
const User = require("../models/user_model");

router.get("/signin", (req, res) => {
  return res.render("signIn_page", {
    currentPath: req.path,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signUp_page", {
    currentPath: req.path,
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("token", token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signIn_page", {
      currentPath: req.path,
      error: "Incorrect Email or Password",
    });
  }
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

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
