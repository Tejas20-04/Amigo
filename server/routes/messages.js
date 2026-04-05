const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/Users");
// ✅ import User model
const jwt = require("jsonwebtoken");
const vjwt = require("../middleware/verifyToken");
const Message = require("../models/Message");
const client = require("../redis/redisclient");
require("dotenv").config();
// message history retrieval
router.get("/user_msg/:otherUserId", vjwt, async (req, res) => {
  try {
    const my_id = req.user.id;
    const person_id = req.params.otherUserId;
    const messages = await Message.find({
      $or: [
        { sender_id: my_id, rec_id: person_id },
        { sender_id: person_id, rec_id: my_id },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: "Error fetching users" });
  }
});
//online users
router.get("/onusers", vjwt, async (req, res) => {
  try {
    const keys = await client.keys("online:*");
    const onlineIds = keys.map((key) => key.replace("online:", "")); // ✅ strip prefix
    res.json(onlineIds);
  } catch (error) {
    console.log("Error fetching online status");
    res.status(400).json({ message: "Error fetching online users" });
  }
});

module.exports = router;
