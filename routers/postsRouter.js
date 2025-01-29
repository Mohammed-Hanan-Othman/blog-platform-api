// Implements methods in the post controller
const Router = require("express");
const { protectRoute } = require("../middlewares/authToken");
const { getAllPosts, createPost } = require("../controllers/postsController");
const { validatePost } = require("../middlewares/postValidator");
const { handleValidationErrors } = require("../middlewares/handleValidation");


// Handles /api/posts/..
const postsRouter = Router();

postsRouter.get("/",
    protectRoute,
    getAllPosts
);

postsRouter.post("/",
    protectRoute,
    validatePost,
    handleValidationErrors,
    createPost
)

module.exports = {postsRouter};