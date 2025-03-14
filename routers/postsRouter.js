// Implements methods in the post controller
const { Router } = require("express");
const { protectRoute } = require("../middlewares/authToken");
const { getAllPosts, 
    createPost, 
    getSinglePost, 
    updatePost, 
    deletePost, 
    updatePostStatus,
    createComment, 
    getAllComments
} = require("../controllers/postsController");
const { validatePost, 
    validatePostUpdate,
    validatePostId, 
    validatePostStatus 
} = require("../middlewares/postValidator");
const { handleValidationErrors } = require("../middlewares/handleValidation");
const { validateCommentContent } = require("../middlewares/commentValidator");

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
    deletePost
);

postsRouter.put("/:id/status",
    protectRoute,
    validatePostId,
    validatePostStatus,
    handleValidationErrors,
    updatePostStatus
);

postsRouter.get("/:id/comments",
    protectRoute,
    validatePostId,
    handleValidationErrors,
    getAllComments
);

postsRouter.post("/:id/comments", 
    protectRoute,
    validatePostId,
    validateCommentContent,
    handleValidationErrors,
    createComment
);
module.exports = { postsRouter };