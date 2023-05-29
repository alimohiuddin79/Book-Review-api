import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;
    let cookies = req.cookies;
    console.log(token);
    console.log(cookies);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId);
        } catch (error) {
            res.status(401).json({ rror: "Not authorized" });
        }
    } else {
        res.status(401).json({ error: "Not authorized, no token" });
    }
    next();
}

export default protect;