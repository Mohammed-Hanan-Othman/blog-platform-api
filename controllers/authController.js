const getSignupPage =  (req, res) => {
    res.status(200).json({message:"Register here"});
}
const postSignup = async (req, res) => {
    res.status(200).json({message:"Registration is being processed here!"});
}

const getLoginPage = (req, res) => {
    res.status(200).json({message:"This is the login page"});
}
const postLogin = async (req, res) => {
    res.status(200).json({message:"Attempting login......"});
}
module.exports = {
    getSignupPage,
    postSignup,
    getLoginPage,
    postLogin,
};