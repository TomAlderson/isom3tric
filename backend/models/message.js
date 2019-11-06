const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  sender_id: { type: String, required: true },
  recipient_id: { type: String, required: true },
  message: { type: String, required: true },
  sent_at: { type: Date, default: Date.now },
  read: { type: Boolean, default: 0 }
});

module.exports = mongoose.model("Message", messageSchema);
