const mongoose = require("mongoose");

mongoose
  // .connect(process.env.MONGODB_CONNECT_URI)
  .connect("mongodb://127.0.0.1:27017/socialMedia")
  .then(() => {
    console.log("Db connected");
  })
  .catch((err) => console.log(err));
