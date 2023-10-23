const express = require("express");
const multer = require('multer');
const isLoggin = require("../../middlewares/isLoggin");
const {
    createPost,
    getAllPosts,
    getPost,
    updatingPost,
    deletePost,
    likedPost,
} = require("../../controllers/posts/posts");
const isAccountVerified = require("../../middlewares/isVarified");
const storage = require("../../utils/uploadFile");

const postsRouter = express.Router();
const upload = multer({ storage });

//create
postsRouter.post("/", isLoggin, upload.single("file"), isAccountVerified, createPost);

// get all post
postsRouter.get("/", getAllPosts);

// get specific posts
postsRouter.get("/:id", getPost);

//update post
postsRouter.put("/:id", isLoggin, upload.single("file"), updatingPost);

//delete post
postsRouter.delete("/:id", isLoggin, deletePost);

//like post
postsRouter.put("/likes/:id", isLoggin, likedPost);

//export
module.exports = postsRouter;
