// This handles replies to comments
const { Router } = require("express");
const { createReply, getAllReplies, getSingleReply } = require("../controllers/repliesController");
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
repliesRouter.put("/:id",(req, res) =>{

});
// Delete a comment 
repliesRouter.delete("/:id",(req, res) =>{

});
module.exports = { repliesRouter };