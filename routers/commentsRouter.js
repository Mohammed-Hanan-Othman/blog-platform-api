// Implements methods in the comment controller
const { Router } = require("express");
const { protectRoute } = require("../middlewares/authToken");
const { validateCommentId, validateCommentContent } = require("../middlewares/validators/commentValidator");
const { handleValidationErrors } = require("../middlewares/validators/handleValidation");
const { getSingleComment, updateComment, 
    deleteComment,
} = require("../controllers/commentsController");
const commentsRouter = Router();

commentsRouter.get("/:id",
    protectRoute,
    validateCommentId,
    handleValidationErrors,
    getSingleComment
);
commentsRouter.put("/:id",
    protectRoute,
    validateCommentId,
    validateCommentContent,
    handleValidationErrors,
    updateComment
);
commentsRouter.delete("/:id",
    protectRoute,
    validateCommentId,
    handleValidationErrors,
    deleteComment
);

module.exports = { commentsRouter };