const { request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/User/User");

const isLoggin = (req, res, next) => {
    //get token from header
    const token = req.headers.authorization?.split(" ")[1];

    //verify users
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        //get the user id
        const userId = decoded?.user?.id;
        const user = await User.findById(userId).select("username email role _id");

        //save user  to req obj
        req.userAuth = user;
        if (err) {
            const err = new Error("Invalid/expired token");
            next(err);
        } else {
            next();
        }
    });
};

module.exports = isLoggin;
