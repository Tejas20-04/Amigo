const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authheader = req.headers["authorization"];
  if (!authheader) return res.status(401).json({ message: "Unauthorized" });
  const token = authheader.split(" ")[1]; //dont forget s with headers
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verify; // attach verify to req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = verifyToken;
