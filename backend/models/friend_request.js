const mongoose = require("mongoose");

const friendRequestSchema = mongoose.Schema({
  sender_id: { type: String, required: true },
  recipient_id: { type: String, required: true }
});

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
