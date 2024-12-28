const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 3000;
const { adminAuth, userAuth } = require("./middlewares/auth");
app.use(express.json());

// Handle the route /user with the adminAuth middleware

app.use("/admin", adminAuth);
app.use("/user", userAuth);

const ALLOWED_UPDATES = [
  "firstName",
  "lastName",
  "photoUrl",
  "about",
  "skills",
];
const isValidUpdateOperation = (updates) => {
  return updates.every((update) => ALLOWED_UPDATES.includes(update));
};

//user
app.post("/user/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await User.save();
    res.send("User added successfully " + user);
  } catch (error) {
    res.status(500).send("Error while adding user " + error.message);
  }
});

app.get("/user/userData", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Error while fetching user data " + error.message);
  }
});

app.delete("/user/deleteUser", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.findOneAndDelete({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send("User deleted successfully");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/user/updateUserPartially", async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!isValidUpdateOperation(Object.keys(req.body))) {
      throw new Error("Invalid updates");
    }
    const users = await User.findByIdAndUpdate({ _id: userId }, req.body, {
      returnDocument: true,
      runValidators: true,
    });
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send("User updated successfully");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Admin

app.post("/admin/addUser", async (req, res) => {
  const user = new User(req.body);
  try {
    if (req.body?.skills.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    await user.save();
    res.send("User added successfully " + user);
  } catch (error) {
    res.status(500).send("Error while adding user " + error.message);
  }
});

app.get("/admin/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Error while fetching user data " + error.message);
  }
});

app.get("/admin/allUser", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Error while fetching user data " + error.message);
  }
});

app.delete("/admin/deleteUser", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.deleteMany({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send("User deleted successfully");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/admin/updateUser", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.updateMany({ emailId: userEmail }, req.body);
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send("User updated successfully");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/admin/updateUserPartially/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    if (!isValidUpdateOperation(Object.keys(req.body))) {
      throw new Error("Invalid updates");
    }
    if (req.body?.skills.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    const users = await User.findByIdAndUpdate({ _id: userId }, req.body, {
      returnDocument: true,
      runValidators: true,
    });
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send("User updated successfully");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log("Server is listioning on port:" + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", (err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).send("There was a server side error!");
  }
  res.send("/default route.");
});
