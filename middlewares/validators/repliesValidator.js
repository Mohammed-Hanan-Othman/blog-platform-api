const { check, param } = require("express-validator");

const validateReply = [
    check("content").trim().notEmpty().escape()
        .withMessage("Reply content cannot be empty")
];
const validateReplyId= [
    param("replyId").trim().notEmpty().escape()
        .withMessage("Reply id is required")
        .isAlphanumeric().withMessage("Post id invalid"),
];
module.exports = {
    validateReply,
    validateReplyId
};