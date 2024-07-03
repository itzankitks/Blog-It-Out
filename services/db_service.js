const mongoose = require("mongoose");

async function connectToMongoDB(_url) {
  await mongoose
    .connect(_url)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(`Error while connecting: ${e}`));
}

module.exports = { connectToMongoDB };
