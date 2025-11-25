const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  title:{
    type: String,
    requried: true,
  },
  color:{
    type: String,
    requried: true,
  },
  repeatMode:{
    type: String,
    enum: ["daily", "weekly"],
    default: "daily",
  },
  reminder:{
    type: Boolean,
    default: false,
  },
  completed:{
    type: Object,
    default: {},
  },
  createAt:{
    type: Date,
    default: Date.now,
  },
})