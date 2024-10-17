const isAdmin = (req, res, next) => {
    if(req.role !== 'admin'){
        return res.status(403).send({success: false, message: 'You are not allowed to to perfrorm this action. Please try to login as an admin.' });
    }
    // test
    next();
}

module.exports = isAdmin;