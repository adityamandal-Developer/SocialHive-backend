const express = require("express");
const isLoggin = require("../../middlewares/isLoggin");
const { creatingComment, deleteComment, updatingComment } = require("../../controllers/comments/comments");


const commentRouter = express.Router();

//create
commentRouter.post("/:postId", isLoggin, creatingComment);
//update
commentRouter.put("/:id", isLoggin, updatingComment);
//delete
commentRouter.delete("/:id", isLoggin, deleteComment);



//export
module.exports = commentRouter;
