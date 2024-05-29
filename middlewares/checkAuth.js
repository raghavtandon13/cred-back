const User = require("../models/user.model");
const { AUTH_TOKEN_MISSING_ERR, AUTH_HEADER_MISSING_ERR, JWT_DECODE_ERR, USER_NOT_FOUND_ERR } = require("../errors");
const { verifyJwtToken } = require("../utils/token.util");

module.exports = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) return next({ status: 403, message: AUTH_HEADER_MISSING_ERR });

        const token = header.split("Bearer ")[1];
        if (!token) return next({ status: 403, message: AUTH_TOKEN_MISSING_ERR });

        const userId = verifyJwtToken(token, next);
        if (!userId) return next({ status: 403, message: JWT_DECODE_ERR });

        const user = await User.findById(userId);
        if (!user) return next({ status: 404, message: USER_NOT_FOUND_ERR });

        res.locals.user = user;
        next();
    } catch (err) {
        next(err);
    }
};
