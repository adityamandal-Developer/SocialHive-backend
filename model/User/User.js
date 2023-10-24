const mongoose = require("mongoose");
const crypto = require("crypto");
//schema

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["user", "admin"],
            default: "user",
        },
        password: {
            type: String,
            required: true,
        },
        lastLogin: {
            type: Date,
            default: Date.now(),
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
        },
        location: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["male", "female", "prefer not to say", "non-binary"],
        },
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: Date,
        },
        accountVerificationToken: {
            type: String,
        },
        accountVerificationExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //10 min to expire and reset token
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //! 10 minutes
    return resetToken;
};
//generate token for acc verify
userSchema.methods.generateAccountVerificationToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.accountVerificationToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //the verification expires in 10 min and resets the token
    this.accountVerificationExpires = Date.now() + 10 * 60 * 1000; //! 10 minutes
    return resetToken;
};

//compile schema to model
const User = mongoose.model("User", userSchema);
module.exports = User;
