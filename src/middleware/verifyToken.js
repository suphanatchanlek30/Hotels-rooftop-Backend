const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
    try {
        // const token = req.cookies.token;

        const token = req.headers.authorization?.split(' ')[1]; // Bearer token

        if(!token) {
            return res.status(401).send({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded.userId) {
            return res.status(401).send({ message: "Invalid token provided" });
        }

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();

    } catch (error) {
        console.error("Error verify token", error);
        res.status(401).send({ message: "Invalid token"});
    }
}

module.exports = verifyToken;