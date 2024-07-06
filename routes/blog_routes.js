const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const Blog = require("../models/blog_model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog_page", {
    user: req.user,
    currentPath: req.path,
  });
});

router.get("/:blogId", async (req, res) => {
  const blog = await Blog.findById(req.params.blogId).populate("createdBy");
  console.log("blog:",blog);
  return res.render("viewBlog_page", {
    user: req.user,
    blog: blog,
    currentPath: req.path,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const blog = await Blog.create({
    title: req.body.title,
    body: req.body.body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  // return res.redirect('/');
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
