const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.get('/test', (req, res) => {
    res.send('Hello World! I am newly born server.');
})

app.use('/use', (req, res) => {
    res.send('/use route.');
})
app.listen(port, () => {
    console.log("Server is listioning on port:"+ port);
});

                             