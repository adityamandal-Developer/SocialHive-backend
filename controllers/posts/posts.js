const asyncHandler = require("express-async-handler");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const Category = require("../../model/Category/Category");

//this function creats a post

exports.createPost = asyncHandler(async (req, res) => {
    //check if  the user is verified
    const userFound = await User.findById(req.userAuth._id);
    if (!userFound) {
        throw new Error("User Not found");
    }
    if (!userFound?.isVerified) {
        throw new Error("Verify your Account");
    }
    // Getting the data from the payload
    const { title, content, categoryId } = req.body;

    //check if post  already exists or not
    const postFound = await Post.findOne({ title });
    if (postFound) {
        throw new Error("This post already exists!!");
    }

    // Creates a post
    const post = await Post.create({
        title,
        content,
        category: categoryId,
        author: req?.userAuth?._id,
        image: req?.file?.path,
    });
    // add post to a user
    await User.findByIdAndUpdate(
        req?.userAuth?._id,
        {
            $push: { posts: post._id },
        },
        {
            new: true,
        }
    );

    // add a post into a specific category
    await Category.findByIdAndUpdate(
        req?.userAuth?._id,
        {
            $push: { posts: post._id },
        },
        {
            new: true,
        }
    );

    // Sending the respose
    res.json({
        status: "sucess",
        message: "post is successfully created",
        post,
    });
});

// getting all the posts
//routh path is for this is /api/v1/posts

exports.getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate("comments").populate("category");

    res.status(201).json({
        status: "success",
        message: "posts are sucessfully fetched",
        posts,
    });
});

// this function is to get one single post and requires postId to get access

exports.getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate("author")
        .populate("category")
        .populate({
            path: "comments",
            model: "Comment",
            populate: {
                path: "author",
                select: "username",
            }
        });

    res.status(201).json({
        status: "success",
        message: "post is sucessfully fetched",
        post,
    });
});

//this function is to delete single post
//route path for this is /api/v1/cposts/:id

exports.deletePost = asyncHandler(async (req, res) => {
    //find the post
    const postFound = await Post.findById(req.params.id);
    const theAuthor =
        req.userAuth?._id.toString() === postFound?.author?._id.toString();
    if (!theAuthor) {
        throw new Error("You cant delete this post");
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "post was sucessfully deleted!!",
    });
});

//this function is to update a specific post and requires postId
//route path is /api/v1/posts/:id

exports.updatingPost = asyncHandler(async (req, res) => {
    //! this is done to Check if the post exists
    const { id } = req.params;
    const postFound = await Post.findById(id);
    if (!postFound) {
        throw new Error("Post not found");
    }
    //! image update
    const { title, category, content, categoryId } = req.body;
    console.log(req.body);
    const post = await Post.findByIdAndUpdate(
        id,
        {
            image: req?.file?.path ? req?.file?.path : postFound?.image,
            title: title ? title : postFound?.title,
            category: category ? category : postFound?.category,
            content: content ? content : postFound?.content,
            categoryId: categoryId ? categoryId : postFound?.categoryId,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(201).json({
        status: "success",
        message: "post successfully updated",
        post,
    });
});

exports.likedPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userAuth._id;
        const post = await Post.findOneAndUpdate(
            { _id: id },
            { $addToSet: { likes: userId }, $pull: { dislikes: userId } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post liked successfully", post });
    } catch (error) {
        res
            .status(500)
            .json({ message: "There was an error", error: error.message });
    }
};
