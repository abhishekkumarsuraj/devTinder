const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { vaildateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const { userAuth } = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());

// Handle the route /user with the adminAuth middleware

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

app.post("/signup", async (req, res) => {
  try {
    //validation of data
    vaildateSignUpData(req);
    const { firstName, lastName, emailId, password, age } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    //Creating new instance and user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
    });
    await user.save();
    res.send("User added successfully " + user);
  } catch (error) {
    res.status(500).send("Error while signing Up user: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    let { emailId, password } = req.body;
    emailId = emailId.toLowerCase();
    console.log(emailId);
    const user = await User.findOne({ emailId: emailId });
    if (!user || user.emailId !== emailId) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();//jwt.sign({ _id: dbUser._id }, "DEV@Tinder$790",{ expiresIn: '1h' });

    // And add the token to cookie send it to the user in response
    res.cookie("token", token);

    res.send("User logged In successfully with emailId: " + emailId);
  } catch (error) {
    res.status(500).send("Error while logging in user: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(" Error while fetching user data " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    // Sending connection request
    res.status(200).send(req.user.firstName+" "+req.user.lastName+" has sent Connection request successfully");
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
