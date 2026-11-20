import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const FetchUser = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({
            err: "Please Authenticate Using a Valid Token"
        });
    }

    try {
        const decode = JWT.verify(token, JWT_SECRET);

        req.userId = decode.user.id;

        next();

    } catch (error) {
        return res.status(401).json({
            err: "Invalid Token"
        });
    }
};

export default FetchUser;