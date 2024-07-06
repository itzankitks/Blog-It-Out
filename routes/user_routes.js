const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const User = require("../models/user_model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/userPFP/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

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
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signIn_page", {
      currentPath: req.path,
      error: "Incorrect Email or Password",
    });
  }
});

router.post("/signup", upload.single("profileImage"), async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
    profileImageURL: `/userPFP/${req.file.filename}`,
  });
  return res.redirect("/user/signin");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
