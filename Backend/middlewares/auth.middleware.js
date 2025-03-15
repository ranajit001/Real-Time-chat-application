import jwt from "jsonwebtoken";

const protectRoute = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};



export{protectRoute} 




