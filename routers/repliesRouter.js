// This handles replies to comments
const { Router } = require("express");
const { createReply, getAllReplies, getSingleReply, updateReply, deleteReply } = require("../controllers/repliesController");
const { protectRoute } = require("../middlewares/authToken");
const { validateReply } = require("../middlewares/validators/repliesValidator");
const { handleValidationErrors } = require("../middlewares/validators/handleValidation");

const repliesRouter = Router({ mergeParams: true }); 

// Get all replies to a comment
repliesRouter.get("/",
    protectRoute,
    getAllReplies
);
// Get a specific reply to a comment
repliesRouter.get("/:id",
    protectRoute,
    getSingleReply
);
// Create a reply to a comment
repliesRouter.post("/",
    protectRoute,
    validateReply,
    handleValidationErrors,
    createReply,
);
// Edit a reply to a comment
repliesRouter.put("/:id",
    protectRoute,
    validateReply,
    handleValidationErrors,
    updateReply
);
// Delete a comment 
repliesRouter.delete("/:id",
    protectRoute,
    deleteReply
);
module.exports = { repliesRouter };