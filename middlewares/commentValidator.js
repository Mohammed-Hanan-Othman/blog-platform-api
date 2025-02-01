const { check, param } = require("express-validator");

const validateCommentContent = [
    check("content").trim().notEmpty().escape()
        .withMessage("Comment cannot be empty")
];
const validateCommentId = [
    param("id").trim().notEmpty().escape()
        .withMessage("Comment id is required")
        .isAlphanumeric().withMessage("Post id invalid"),
];
module.exports = {
    validateCommentContent,
    validateCommentId
};