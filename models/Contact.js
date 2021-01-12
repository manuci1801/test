const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("contacts", contactSchema);
