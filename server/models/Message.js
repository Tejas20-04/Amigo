const mongoose = require("mongoose");

const msg = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rec_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = model.mongoose("Message", msg);
