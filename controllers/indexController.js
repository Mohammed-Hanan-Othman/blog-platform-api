const getIndexPage =  (req, res) => {
    res.status(200).json({message:"Register here"});
}

module.exports = {
    getIndexPage
};