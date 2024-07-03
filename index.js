const express = require('express');
const path = require('path');
const ejs = require('ejs');

const userRoute = require('./routes/user_routes');
const { connectToMongoDB } = require('./services/db_service');

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/BlogItOut");

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    return res.render("home_page");
});

app.use('/user', userRoute);


app.listen(PORT, () => console.log(`Server Started at port -> ${PORT}`));