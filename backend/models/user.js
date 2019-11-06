const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require('dotenv').config();

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  figure: { type: String, required: true, default: process.env.DEFAULT_FIGURE },
  dob: { type: Date, required: true },
  mission: { type: String, max: 140 },
  gender: { type: Number, required: true, default: 1 },
  swearing: { type: Boolean, default: false },
  private: { type: Boolean, default: false },
  friend_requests: { type: Boolean, default: true },
  credits: { type: Number, default: 0 }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
