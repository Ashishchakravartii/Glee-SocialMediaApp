const mongoose = require("mongoose");
const postmodel = new mongoose.Schema(
  {
    media: String,
    caption: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("post", postmodel);
