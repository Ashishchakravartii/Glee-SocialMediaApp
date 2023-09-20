const mongoose= require("mongoose")
const plm= require("passport-local-mongoose")

const UserModel = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Username field must not empty"],
    minLength: [4, "Username field must have atleast 4 characters"],
  },
  password: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Email address is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Invalid email address",
    ],
  },
  avatar: {
    type: String,
    default: "default.png",
  },
  posts:[{type:mongoose.Schema.Types.ObjectId,ref:"post"}],
  bio: String,
});
UserModel.plugin(plm)
const user= mongoose.model("User",UserModel);
module.exports= user;