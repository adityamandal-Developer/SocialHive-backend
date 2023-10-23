const asyncHandler = require("express-async-handler");
const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");

//this function is for creating a comment
// the route path for this is /api/v1/comments/:postId

exports.creatingComment = asyncHandler(async (req, res) => {
    //getting the payload
    const { message, author } = req.body;
    //get post id from params
    const postId = req.params.postId;
    //* Create comment
    const comment = await Comment.create({
        message,
        author: req.userAuth._id,
        postId,
    });
    await Post.findByIdAndUpdate(
        postId,
        {
            $push: { comments: comment._id },
        },
        { new: true }
    );
    //send the response
    res.json({
        status: "success",
        message: "Comment created successfully",
        comment: comment,
    });
});

//Delete comment
//route for delete comments is /api/v1/comments/:id

exports.deleteComment = asyncHandler(async (req, res) => {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(201).json({
        status: "success",
        message: "Comment successfully deleted",
    });
});

// update comment
//route for update /api/v1/comments/:id


exports.updatingComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
            message: req.body.message,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(201).json({
        status: "success",
        message: "comment successfully updated",
        comment,
    });
});
