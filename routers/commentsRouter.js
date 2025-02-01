// Implements methods in the comment controller
const { Router } = require("express");
const commentsRouter = Router();

commentsRouter.get("/:id",
    (req, res) => {
        res.status(200).json({message:"Get a specific comment"});
    }
);
commentsRouter.put("/:id",
    (req, res) => {
        res.status(200).json({message:"Update a specific comment"});
    }
);
commentsRouter.delete("/:id",
    (req, res) => {
        res.status(200).json({message:"Delete a specific comment"});
    }
);

module.exports = { commentsRouter };