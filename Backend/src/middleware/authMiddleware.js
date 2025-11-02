import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
  try {
    const token =
    req.cookies.token ||
    req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) return res.status(401).json({ message: "No token provided." });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
