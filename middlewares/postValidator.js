const { check, param } = require("express-validator");

const wordCountValidator = (min) => (value) => {
    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount < min) {
        throw new Error(`Field must be at least ${min} words`);
    }
    return true;
};

const validatePost = [
    check("title").trim().notEmpty().escape()
        .withMessage("Title is required")
        .isLength({min: 3, max:250})
        .withMessage("Title must be between 3 and 250 characters long"),
    
    check("content").trim().notEmpty().escape()
        .withMessage("Content is required")
        .custom(wordCountValidator(50)),
    
    check("status").trim().notEmpty().escape()
        .withMessage("Status is required")
        .isIn(["draft","published"])
        .withMessage("Posts status can only be 'draft' or 'published'")
];
const validatePostUpdate = [
    param("id").trim().notEmpty().escape().withMessage("Post id is required")
        .isAlphanumeric().withMessage("Post id invalid"),

    check("title").notEmpty().escape().withMessage("Title is required")
        .isLength({min: 3, max:250})
        .withMessage("Title must be between 3 and 250 characters long"),

    check("content").notEmpty().escape().withMessage("Content is required")
        .custom(wordCountValidator(50)),

    check("status").trim().notEmpty().escape()
        .withMessage("Status is required")
        .isIn(["draft","published"])
        .withMessage("Posts status can only be 'draft' or 'published'")
];
const validatePostId = [
    param("id").trim().notEmpty().escape().withMessage("Post id is required")
        .isAlphanumeric().withMessage("Post id invalid")
];
module.exports = {
    validatePost,
    validatePostUpdate,
    validatePostId
}