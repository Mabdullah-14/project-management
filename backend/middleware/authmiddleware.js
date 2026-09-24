const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token || token === 'undefined') {
            return res.status(401).json({
                message: 'Access Denied. Forbidden Access'
            });
        }

        const decodedData = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decodedData;

        next();

    } catch (error) {
        console.log(error);

        error.status=403;
       next(error)
    }
};
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access Denied. You do not have permission to perform this action."
            });
        }

        next();
    };
};


module.exports = {authMiddleware,roleMiddleware};