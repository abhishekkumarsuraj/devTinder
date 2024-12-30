const validator = require("validator");
const passwordInstructions = "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character";
const vaildateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;


   if (!firstName || !lastName || !emailId || !password) {
    throw new Error("Please provide Name, EmailId and Password to signup");
   } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email " + emailId);
   } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong"+ passwordInstructions);
   }
}

module.exports = { vaildateSignUpData };