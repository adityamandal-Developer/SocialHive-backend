const express = require("express");
const multer = require("multer");
const {
    registerUser,
    login,
    getProfile,
    resettingPassword,
    resetPassword,
    accountVerificationEmail,
    verifyAccount,
    getPublicProfile,
    uploadeCoverImage,
    uploadeProfilePicture,
} = require("../../controllers/users/usersControl");
const isLoggin = require("../../middlewares/isLoggin");
const storage = require("../../utils/uploadFile");

const usersRouter = express.Router();
const upload = multer({ storage });

//register a user
usersRouter.post("/registerUser", registerUser);

//login
usersRouter.post("/login", login);

// upload profile image
usersRouter.put(
    "/upload-profile-image",
    isLoggin,
    upload.single("file"),
    uploadeProfilePicture
);

//profile cover
usersRouter.put("/upload-cover-picture", isLoggin, upload.single("file"), uploadeCoverImage);

//profile
usersRouter.get("/profile/", isLoggin, getProfile);

//Public profile
usersRouter.get("/public-profile/:userId", getPublicProfile);

//password forgot
usersRouter.post("/forgot-password", resettingPassword);

//password forgot
usersRouter.post("/reset-password/:resetToken", resetPassword);

//verify account email
usersRouter.put(
    "/account-verification-email",
    isLoggin,
    accountVerificationEmail
);

//verify account email with token
usersRouter.get("/account-verification/:verifyToken", isLoggin, verifyAccount);
//export
module.exports = usersRouter;
