const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user_routes');
const blogRoute = require('./routes/blog_routes');
const { connectToMongoDB } = require('./services/db_service');
const { checkForAuthenticationCookie } = require('./middlewares/authentication_middleware');

const Blog = require("./models/blog_model");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/BlogItOut");

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    return res.render("home_page", {
        user: req.user,
        currentPath: req.path,
        blogs: allBlogs,
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server Started at port -> ${PORT}`));