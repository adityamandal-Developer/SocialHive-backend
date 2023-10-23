const Category = require("../../model/Category/Category");
const asyncHandler = require("express-async-handler");

//this is for creating a category
//the route path is /api/v1/categories

exports.creatinngCategory = asyncHandler(async (req, res) => {
    const { name, author } = req.body;

    // Check if the category already exits or not
    const categoryIsFound = await Category.findOne({ name });
    if (categoryIsFound) {
        throw new Error("category alredy exists!");
    }
    const category = await Category.create({
        name: name,
        author: req.userAuth?._id,
    });
    res.status(201).json({
        status: "success",
        message: "category sucessfully created :-)",
        category,
    });
});

//this is to get all the categories
//path is /api/v1/categories

exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});

    res.status(201).json({
        status: "success",
        message: "categories sucessfully fetched",
        categories,
    });
});

//this is for delete category
//route path is /api/v1/categories/:id

exports.deleteCategory = asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "category sucessfully deleted!",
    });
});

//update category
//route is PUT /api/v1/categories/:id


exports.updatingCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(201).json({
        status: "success",
        message: "category was sucessfully updatedv :-)",
        category,
    });
});
