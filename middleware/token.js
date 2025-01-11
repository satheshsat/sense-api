const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; 

    if(!token) {
        return res.status(403).json({
            message: 'Token is required'
        });
    }
    if(token.substring(0,7) !== "Bearer "){
        return res.status(403).json({
            message: 'Token is required'
        });
    }
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");

    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
            return res.status(403).json({
                error: "token_expired",
                message: 'Token is not valid'
            });
            }
            // if(decoded.role=='user'){
            //     if(req.originalUrl.indexOf('/api/auth') == -1){
            //         return res.status(403).json({
            //             message: 'Token is not valid'
            //         });
            //     }
            // }
            req.decoded = decoded;
            next();
        });
    } else {
        return res.status(403).json({
            message: 'Unathorized'
        });
    }
}

module.exports = {
    validateToken
};