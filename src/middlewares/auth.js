const adminAuth = (req, res, next) => {
    console.log("adminAuth middleware called");
    const token = req.header('Authorization');
    if (token === 'admin') {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

const userAuth = (req, res, next) => {
    console.log("userAuth middleware called");
    const token = req.header('Authorization');
    if (token === 'user') {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

module.exports = {adminAuth, userAuth};