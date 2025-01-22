require("dotenv").config();
const express = require("express");

const app = express();
app.get("/",(req, res)=>{
    res.status(200).json({message:"Welcome to the blog api"});
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})