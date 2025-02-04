// Implements methods in the users controller
const { Router } = require("express");
const usersRouter = Router();

// Handles /api/users
usersRouter.get("/", (req, res) => {
    res.status(200).json({message:"See all the users here"});
});
usersRouter.put("/me", (req, res) => {
    res.status(200).json({message:"Update user's personal information"});
});
usersRouter.get("/:id", (req, res) => {
    res.status(200).json({message:"Info on specific user: Admin only"});
});
usersRouter.delete("/:id", (req, res) =>{
    res.status(200).json({message:"Delete a specific user"});
});

module.exports = { usersRouter };