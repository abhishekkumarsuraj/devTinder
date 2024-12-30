const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminAuth = (req, res, next) => {
    console.log("adminAuth middleware called");
    const token = req.header('Authorization');
    if (token === 'admin') {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

const userAuth = async (req, res, next) => {

    try {
        const {token} = req.cookies;
        if (!token) {
            throw new Error("Token not Valid");
        }
        const decodedObj = jwt.verify(token, "DEV@Tinder$790");
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized " + error.message);
    }

};

module.exports = {adminAuth, userAuth};