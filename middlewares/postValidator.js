const { check } = require("express-validator");

const validatePost = [
    check("title").notEmpty().withMessage("Title is required")
        .isLength({min: 3, max:250})
        .withMessage("Title must be between 3 and 250 characters long"),
    
    check("content").notEmpty().withMessage("Content is required")
        .isLength({min: 3})
        .withMessage("Content must be at least 200 words long"),
    
    check("status").notEmpty().withMessage("Status is required")
        .isIn(["draft","published"])
        .withMessage("Posts status can only be 'draft' or 'published'")
];

module.exports = {
    validatePost
}