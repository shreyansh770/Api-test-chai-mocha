const jwt = require('jsonwebtoken');
require('dotenv/config')
const JWT_KEY = process.env.JWT_KEY

module.exports.protectRoute = function protectRoute(req, res, next) {

    try {


        let token =req.headers.cookie.split("=")[1]
        
        if (token) {
            let isVerified = jwt.verify(token, JWT_KEY);
            if (isVerified) {
                req.aId = isVerified.id
                next();
            } else {
                res.json({
                    message: "Please log in"
                })
            }

        } else {
            res.json({
                message: "Please log in"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}