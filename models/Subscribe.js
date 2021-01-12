const mongoose = require("mongoose");

const subscribeSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = mongoose.model("subscribes", subscribeSchema);
