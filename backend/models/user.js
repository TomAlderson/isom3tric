const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require('dotenv').config();

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  figure: { type: String, required: true, default: process.env.DEFAULT_FIGURE },
  date_of_birth: { type: Date, required: true },
  mission: { type: String, max: 140 },
  gender: { type: Number, required: true, default: 1 },
  swearing: { type: Boolean, default: false },
  private: { type: Boolean, default: false },
  credits: { type: Number, default: 0 },
  club_days: { type: Number, default: 0 },
  console_mission: { type: String }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
