const express = require('express');
const app = express();
const port = 3000;
const { adminAuth, userAuth } = require('./middlewares/auth');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let user = { firstName: 'john', lastName: 'doe'};

// Handle the route /user with the adminAuth middleware

app.use('/admin', adminAuth);
app.use('/user', userAuth);


app.get('/admin/allUser', (req, res) => { 
    res.send(user)
})

app.post("/admin/addUser", (req, res) => {
  user = req.body;
  console.log(user);
  res.send("user added successfully");
});

app.delete("/admin/deleteUser", (req, res) => {
  //user = req.body;
  res.send("user deleted successfully");
});

app.get('/user/userData', (req, res) => { 
    res.send(user)
})

app.post("/user/addUser", (req, res) => {
  user = req.body;
  console.log(user);
  res.send("user added successfully");
});

app.delete("/user/deleteUser", (req, res) => {
  //user = req.body;
  res.send("user deleted successfully");
});
 
app.use('/', (req, res) => {
    res.send('/default route.');
})
app.listen(port, () => {
    console.log("Server is listioning on port:"+ port);
});

                             