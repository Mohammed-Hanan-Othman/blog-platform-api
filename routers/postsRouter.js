// Implements methods in the post controller
const Router = require("express");
const { protectRoute } = require("../middlewares/authToken");
const { getAllPosts, createPost, getSinglePost, updatePost, deletePost } 
    = require("../controllers/postsController");
const { validatePost, validatePostUpdate, validatePostId } 
    = require("../middlewares/postValidator");
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
    validatePostId,
    handleValidationErrors,
    getSinglePost
);

postsRouter.put("/:id",
    protectRoute,
    validatePostUpdate,
    handleValidationErrors,
    updatePost
);

postsRouter.delete("/:id",
    protectRoute,
    validatePostId,
    handleValidationErrors,
    deletePost,
);
module.exports = {postsRouter};