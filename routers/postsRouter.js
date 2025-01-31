// Implements methods in the post controller
const Router = require("express");
const { protectRoute } = require("../middlewares/authToken");
const { getAllPosts, createPost, getSinglePost, updatePost } = require("../controllers/postsController");
const { validatePost, validatePostUpdate } = require("../middlewares/postValidator");
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
);
// GET /api/posts/:id
postsRouter.get("/:id",
    getSinglePost
);

postsRouter.put("/:id",
    protectRoute,
    validatePostUpdate,
    handleValidationErrors,
    updatePost
)

module.exports = {postsRouter};