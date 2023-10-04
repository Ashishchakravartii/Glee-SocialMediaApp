const mongoose = require("mongoose");
const postmodel = new mongoose.Schema(
  {
    media: String,
    caption: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        avatar:String,
        username:String
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("post", postmodel);
