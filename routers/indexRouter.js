const { Router } = require("express");
const { getIndexPage } = require("../controllers/indexController");
const indexRouter = Router();


indexRouter.get("/", getIndexPage);
module.exports = {indexRouter};