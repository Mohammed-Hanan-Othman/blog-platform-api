require("dotenv").config();
const express = require("express");
const { authRouter } = require("./routers/authRouter");
const { usersRouter } = require("./routers/usersRouter");
const { postsRouter } = require("./routers/postsRouter");
const { commentsRouter } = require("./routers/commentsRouter");
const { indexRouter } = require("./routers/indexRouter");

const app = express();
app.use("/api/auth/", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/posts/:postId/comments", commentsRouter);
app.use("/", indexRouter);


// Error Handling for undefined routes
app.use((req, res) =>{
    res.status(404).json({message:"Invalid request or resource not found"});
});

// Centralized error handling middleware for server errors
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});