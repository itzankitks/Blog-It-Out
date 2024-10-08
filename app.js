require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user_routes");
const blogRoute = require("./routes/blog_routes");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication_middleware");
const { connectToMongoDB } = require("./services/database_service");

const Blog = require("./models/blog_model");

const app = express();
const PORT = process.env.PORT || 8001;

// MongoDB connection using Mongoose
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).populate("createdBy");
    return res.render("home_page", {
      user: req.user,
      currentPath: req.path,
      blogs: allBlogs,
    });
  } catch (error) {
    console.error("Error fetching blogs", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at port -> ${PORT}`));
