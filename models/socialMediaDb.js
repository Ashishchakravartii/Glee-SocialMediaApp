const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_CONNECT_URI)
  .then(() => {
    console.log("Db connected");
  })
  .catch((err) => console.log(err));
