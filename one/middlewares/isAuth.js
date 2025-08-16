import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    // Assuming your token payload has userId as key
    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Authentication error" });
  }
};

export default isAuth;
