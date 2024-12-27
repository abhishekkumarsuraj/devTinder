const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devtinder:jVo6xyMDgY9vS0OP@devtinder.4j0cc.mongodb.net/devtinder"
  );
};

module.exports = connectDB;