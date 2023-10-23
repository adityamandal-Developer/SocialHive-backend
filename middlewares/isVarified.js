const User = require("../model/User/User");

const isAccountVerified = (req, res, next) => {
    User.findById(req.userAuth._id)
        .then(user => {
            if (user && user.isVerified) {
                return next();
            }
            return res.status(401).json({ message: "Unauthorized: Please verify your account" });
        })
        .catch(error => {
            return res.status(500).json({ message: "There has been an error", error });
        });
};
module.exports = isAccountVerified;
