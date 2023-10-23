const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const expressAsyncHandler = require("express-async-handler");
const emailVerify = require("../../utils/emailVerify");
const emailVerifyAccount = require("../../utils/emailVerifyAccount");

//this function is to register a new user
//the route path for this is /api/v1/users/register (POST method)

exports.registerUser = asyncHandler(async (req, res) => {
    //get the details for registering
    const { username, password, email } = req.body;

    //check if user already exists or not
    const user = await User.findOne({ username });
    if (user) {
        throw new Error("user already exits");
    }
    //registers new user
    const newUser = new User({
        username,
        email,
        password,
    });

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    res.status(201).json({
        status: "success",
        message: "User is sucessfully registered",
        newUser,
    });
});

//this function is for loging-in a  user
//the route path for this is /api/v1/users/login (POST method)

exports.login = asyncHandler(async (req, res) => {
    // getting the login details
    const { username, password } = req.body;
    // check if the details are correct
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error("Invalid login details");
    }
    //comparing the hashed password
    const isMatched = await bcrypt.compare(password, user?.password);
    if (!isMatched) {
        throw new Error("Invalid login details");
    }
    //updates the last login date
    user.lastLogin = new Date();
    res.json({
        status: "success",
        email: user?.email,
        _id: user?._id,
        username: user?.username,
        role: user?.role,
        token: generateToken(user),
        profilePicture: user?.profilePicture,
        isVerified: user?.isVerified,
    });
});

//this function is for getting a profile and needs profile ID

exports.getProfile = asyncHandler(async (req, res, next) => {
    //! get user id from params
    const id = req.userAuth._id;
    const user = await User.findById(id)
        .populate({
            path: "posts",
            model: "Post",
        })
        .populate({
            path: "following",
            model: "User",
        })
        .populate({
            path: "followers",
            model: "User",
        })
        .populate({
            path: "blockedUsers",
            model: "User",
        })
        .populate({
            path: "profileViewers",
            model: "User",
        });
    res.json({
        status: "success",
        message: "Profile fetched",
        user,
    });
});

//this function is for getting a public profile and user profile ID(GET method)

exports.getPublicProfile = asyncHandler(async (req, res, next) => {
    //get user id from params
    const userId = req.params.userId;
    const user = await User.findById(userId)
        .select("-password")
        .populate({
            path: "posts",
            populate: {
                path: "category",
            },
        });
    res.json({
        status: "success",
        message: "Public Profile is sucessfully fetched",
        user,
    });
});

//this function is for resetting password(sending the email with token)

exports.resettingPassword = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound) {
        throw new Error("Email not found");
    }
    const tokenReset = await userFound.generatePasswordResetToken();
    await userFound.save();

    emailVerify(email, tokenReset);
    res.status(200).json({
        message: "Email for resetting your password has been sent",
        tokenReset,
    });
});

exports.resetPassword = expressAsyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const actualCryptoToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const userFound = await User.findOneAndUpdate(
        {
            passwordResetToken: actualCryptoToken,
            passwordResetExpires: { $gt: Date.now() },
        },
        {
            password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
            passwordResetExpires: undefined,
            passwordResetToken: undefined,
        },
        { new: true }
    );

    if (!userFound) {
        throw new Error("Resetting password is expired");
    }

    res.status(200).json({ message: "Password was reset successfully" });
});

exports.accountVerificationEmail = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req?.userAuth?._id); //find user
    if (!user) {
        throw new Error("User not found");
    }
    const token = await user.generateAccountVerificationToken(); // line 165
    await user.save();
    emailVerifyAccount(user?.email, token);
    res.status(200).json({
        message: `account verification email sent ${user?.email}`,
    });
});

exports.verifyAccount = expressAsyncHandler(async (req, res) => {
    const { verifyToken } = req.params;

    const actualCryptoToken = crypto
        .createHash("sha256")
        .update(verifyToken)
        .digest("hex");

    const userFound = await User.findOne({
        accountVerificationToken: actualCryptoToken,
        accountVerificationExpires: { $gt: Date.now() },
    });
    if (!userFound) {
        throw new Error("Invalid Verification credentials");
    }
    userFound.isVerified = true;
    //this is for updating the user(verification)

    userFound.accountVerificationExpires = undefined;
    userFound.accountVerificationToken = undefined;
    await userFound.save(); //saving the user
    res.status(200).json({ message: "Your account is varified sucessfully :-)" });
});

//this function creats a post
exports.uploadeProfilePicture = asyncHandler(async (req, res) => {
    const userFound = await User.findById(req?.userAuth?._id);
    if (!userFound) {
        throw new Error("User not found");
    }
    const user = await User.findByIdAndUpdate(
        req?.userAuth?._id,
        {
            $set: { profilePicture: req?.file?.path },
        },
        {
            new: true,
        }
    );

    //? send the response
    res.json({
        status: "scuccess",
        message: "User profile image updated Succesfully",
        user,
    });
});

exports.uploadeCoverImage = asyncHandler(async (req, res) => {
    const userFound = await User.findById(req?.userAuth?._id);
    if (!userFound) {
        throw new Error("User not found");
    }
    const user = await User.findByIdAndUpdate(
        req?.userAuth?._id,
        {
            $set: { coverImage: req?.file?.path },
        },
        {
            new: true,
        }
    );

    res.json({
        status: "scuccess",
        message: "Profile Cover uploaded",
        user,
    });
});
