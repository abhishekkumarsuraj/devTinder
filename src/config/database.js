const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devtinder:xxxxxxxxxxx@devtinder.4j0cc.mongodb.net/devtinder"
  );
};

module.exports = connectDB;
