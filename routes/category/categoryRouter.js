const express = require("express");
const isLoggin = require("../../middlewares/isLoggin");
const {
    creatinngCategory,
    getAllCategories,
    deleteCategory,
    updatingCategory,
} = require("../../controllers/categories/category");

const categoryRouter = express.Router();

//create
categoryRouter.post("/", isLoggin, creatinngCategory);

//all
categoryRouter.get("/", getAllCategories);

//delete category
categoryRouter.delete("/:id", isLoggin, deleteCategory);

//update category
categoryRouter.put("/:id", isLoggin, updatingCategory);

//export
module.exports = categoryRouter;
