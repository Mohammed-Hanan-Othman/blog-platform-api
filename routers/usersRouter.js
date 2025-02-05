// Implements methods in the users controller
const { Router } = require("express");
const { protectRoute } = require("../middlewares/authToken");
const { getAllUsers, getSingleUser, deleteSingleUser, getMyInfo, updateMyInfo } = require("../controllers/usersController");
const { validateUserId, validateUserInfo } = require("../middlewares/userValidator");
const { handleValidationErrors } = require("../middlewares/handleValidation");
const usersRouter = Router();

// Handles /api/users
usersRouter.get("/", 
    protectRoute,
    getAllUsers
);
usersRouter.get("/me", 
    protectRoute,
    getMyInfo,
);
usersRouter.put("/me", 
    protectRoute,
    validateUserInfo,
    handleValidationErrors,
    updateMyInfo
);
usersRouter.get("/:id", 
    protectRoute,
    validateUserId,
    handleValidationErrors,
    getSingleUser
);
usersRouter.delete("/:id",
    protectRoute,
    validateUserId,
    handleValidationErrors,
    deleteSingleUser
);

module.exports = { usersRouter };