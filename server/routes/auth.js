const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/Users");
// ✅ import User model
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // now hash is available here
    const user = new User({ username, email, password: hash });
    await user.save();
    console.log("Password hashed successfully", hash);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;
  const exist_user = await User.findOne({ username });

  if (exist_user) {
    try {
      const match = await bcrypt.compare(password, exist_user.password);
      if (match) {
        console.log("User verified");

        const token = jwt.sign(
          { id: exist_user._id, username, email },
          process.env.SECRET_KEY, //token asigned to logged i used
        );
        res.json({ token, Message: "User login success" });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.log("Error matching password!!");
    }
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});
module.exports = router;
