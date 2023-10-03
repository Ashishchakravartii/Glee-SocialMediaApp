var express = require("express");
var router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("../models/usermodel");
const PostModel = require("../models/postsModel");

const fs = require("fs");
const upload = require("../utils/multer");
const uploadPost = require("../utils/uploadPost");

passport.use(new LocalStrategy(UserModel.authenticate()));

const { sendmail } = require("../utils/mail");
const { default: axios } = require("axios");

/* GET home page. */
// router.get('/',isLoggedIn, function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// --------- Starting Page ------------------

// router.get("/exploreNow", function (req, res, next) {
//   res.render("exploreNow");
// });
router.get("/", function (req, res, next) {
  res.render("join");
});

// -----------signup---------------

router.get("/signup", (req, res, next) => {
  res.render("signup");
});
router.post("/signup", async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    await UserModel.register({ name, username, email }, password);
    res.redirect("/signin");
  } catch (error) {
    res.send(error.message);
  }
});

// -----------signIn---------------

router.get("/signin", (req, res, next) => {
  res.render("signin");
});
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/signin",
  }),
  (req, res, next) => {}
);

// -------------Home page =================

router.get("/home", isLoggedIn, async (req, res) => {
  try {
    // const allPost = await PostModel.find();
    // res.render("homepage", { user: req.user, allPost });
    PostModel.find({})
      .populate("user", ["username", "avatar"])
      .then((posts) => {
        // Handle successful query results here
        res.render("homepage", { user: req.user, allPost: posts });
      })
      .catch((err) => {
        // Handle errors here
        console.error("Error fetching posts:", err);
      });
  } catch (error) {
    res.send(error);
  }
});
// router.get("/home", isLoggedIn, async (req, res) => {
//   try {
//     const allPost = await PostModel.find();
//     res.render("homepage", { user: req.user, allPost });
//   } catch (error) {
//     res.send(error);
//   }
// });
// ----------- SignOut--------------------

router.get("/signout",isLoggedIn, (req, res, next) => {
  req.logOut(() => {
    res.redirect("/signin");
  });
});

// ----------- Reset --------------------

router.get("/reset",isLoggedIn, (req, res, next) => {
  res.render("reset", { user: req.user });
  console.log(req.user);
});

router.post("/reset/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    await user.changePassword(req.body.oldpassword, req.body.newpassword);
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
  }
});

// ----------------- Get mail page ---------------

router.get("/getEmail", (req, res, next) => {
  res.render("getemail");
});
router.post("/getEmail", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user === null) {
      return res.send(
        "Account not found! Try again <a href='/getEmail'>Forget PAssword</a>"
      );
    }
    sendmail(req, res, user);
  } catch (error) {
    res.send(error);
  }
});

// ---------------- forget PAssword----------

router.get("/change-password/:id",isLoggedIn, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.render("change-Password", { user });
  } catch (error) {
    res.send(error);
  }
});
router.post("/change-password/:id",isLoggedIn, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    await user.setPassword(req.body.password);
    await user.save();
    res.redirect("/signin");
  } catch (error) {
    res.send(error);
  }
});

// ------------profile page ------------

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const { posts } = await req.user.populate("posts");
    console.log(posts);
    var totalCommentCount = 0;
    var totalLikesCount = 0;
    posts.forEach((post) => {
      totalCommentCount += post.comments.length;
      totalLikesCount += post.likes.length;
    });
    res.render("profile", {
      user: req.user,
      posts,
      totalCommentCount,
      totalLikesCount,
    });
  } catch (error) {
    console.log(error);
  }
});

// ------------------ feed user profile ----------

router.get("/feedProfile/:id", async (req, res, next) => {
  try {
    const { posts } = await UserModel.findById(req.params.id).populate("posts");
    var totalCommentCount = 0;
    var totalLikesCount = 0;
    posts.forEach((post) => {
      totalCommentCount += post.comments.length;
      totalLikesCount += post.likes.length;
    });

    const otherUser = await UserModel.findById(req.params.id);
    if (otherUser.username === req.user.username) {
      res.redirect("/profile");
    }
    res.render("feedProfile", {
      otherUser,
      user: req.user,
      posts,
      totalCommentCount,
      totalLikesCount,
    });
  } catch (error) {
    console.log(error);
  }
});

// ----------- Like post Route -----------------

router.post("/like", isLoggedIn, async function (req, res) {
  let loggedinuser = await UserModel.findOne({
    username: req.session.passport.user,
  });
  let post = await PostModel.findOne({ _id: req.body.postId });
  post.likes.push(loggedinuser._id);
  // post.likeuser.push(loggedinuser);
  post.save();
  res.send({ success: true, likes: post.likes.length });
});

router.post("/unlike", isLoggedIn, async function (req, res) {
  let loggedinuser = await UserModel.findOne({
    username: req.session.passport.user,
  });
  let post = await PostModel.findOne({ _id: req.body.postId });
  var unlike = post.likes.indexOf(loggedinuser._id);
  post.likes.splice(unlike, 1);
  post.save();
  res.send({ success: true, likes: post.likes.length });
});

// router.get("/likePost/:postId",isLoggedIn,async(req,res,next)=>{
//   try {
//     const postId= req.params.postId;

//     const post = await PostModel.findById(postId);

//      if (!post) {
//       return res.status(404).send("Post not found");
//     }

//     const userIndex= post.likes.indexOf(req.user._id);
//     if(userIndex !== -1){
//       post.likes.splice(userIndex,1);
//     }else{
//       post.likes.push(req.user._id);
//     }

//      await post.save();
//      res.redirect("/home")

//   } catch (error) {
//     console.log(error);
//   }

// });

// -------------- comment adding route ---------------

router.post("/addComment/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;

    // Find the post by ID
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Create a new comment object
    const newComment = {
      user: req.user._id,
      comment,
    };

    // Add the new comment to the comments array and save the post
    post.comments.push(newComment);
    await post.save();

    res.redirect("/postView/" + postId);
  } catch (error) {
    console.log(error);
  }
});

// ----------- avatar ---------------------------

router.post(
  "/avatar",
  upload.single("avatar"),
  isLoggedIn,
  async (req, res, next) => {
    try {
      if (req.user.avatar !== "default.png") {
        fs.unlinkSync("./public/images/userImages/" + req.user.avatar);
      }
      req.user.avatar = req.file.filename;
      req.user.save();
      res.redirect("/profile");
    } catch (error) {
      res.send(error);
    }
  }
);
// ------------- /saveBio -----------------------

router.post("/saveBio", async (req, res, next) => {
  try {
    // const user= await UserModel.findById(req.user._id);
    req.user.bio = req.body.bio;
    req.user.username = req.body.username;
    await req.user.save();
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});
// --------------- PostView -------------------

router.get("/postView/:id", isLoggedIn, async (req, res, next) => {
  try {
    // const post= await PostModel.findById(req.params.id);

    PostModel.findById(req.params.id)
      .populate("user", ["username", "avatar", "_id"])
      .then((post) => {
        //      // Handle successful query results here
        res.render("PostView", {
          user: req.user,
          post: post,
          id: req.params.id,
        });
      })
      .catch((err) => {
        // Handle errors here
        console.error("Error fetching posts:", err);
      });

    // res.render("PostView",{post});
  } catch (error) {
    console.log(error);
  }
});

// ------- delete post -------------------

router.get("/deletePost/:id", async (req, res, next) => {
  try {
    const postId = req.params.id;

    // Find the post to get the user's ID who created it
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Delete the post
    await PostModel.findByIdAndDelete(postId);

    // Remove the reference to the post from the user's posts array
    const user = await UserModel.findById(post.user);
    if (user) {
      user.posts.pull(postId);
      await user.save();
    }

    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});
// -------------- posts ------------------

router.post(
  "/savePost",
  uploadPost.single("media"),
  isLoggedIn,
  async (req, res, next) => {
    const { caption } = req.body;
    const media = req.file.filename; // Multer stores the uploaded file's path

    // Create a new Post document and save it to your database
    const newPost = new PostModel({
      caption,
      media,
      timestamp: Date.now(),
    });
    newPost.user = req.user._id;
    req.user.posts.push(newPost._id);
    await newPost.save();
    await req.user.save();
    res.redirect("/profile");
  }
);

// ----------------- editProfile---------

router.get("/editProfile", isLoggedIn, (req, res) => {
  res.render("editProfile", { user: req.user });
});

// =========== setting page ==================

router.get("/setting",isLoggedIn,(req,res)=>{
  res.render("setting",{user:req.user})
});
// ---------- confirmation -----------------

router.get("/confirmdeleteaccount", isLoggedIn, (req, res, next) => {
  res.render("confirmdelete",{user:req.user}); // Render a confirmation page (you can create this)
});

// --------- delete account ----------------

router.get("/deleteaccount", isLoggedIn, async (req, res, next) => {

  const userIdToDelete = req.user._id;

  try {
    const user = await UserModel.findById(userIdToDelete);

    if (!user) {
      console.log("User not found");
      return res.redirect("/join"); // Redirect here since the user is not found
    }

    // Find and delete all associated posts
    await PostModel.deleteMany({ user: user._id });

    // Delete the user
    await user.deleteOne();

    console.log("User and associated posts deleted successfully.");
    return res.redirect("/"); // Redirect to a relevant page after successful deletion
  } catch (err) {
    console.error("Error:", err);
    return next(err); // Pass the error to the error handler middleware
  }
});

// ------ discover ----------------

router.get("/discover",isLoggedIn,async(req,res,next)=>{
try {
  // const response = await axios.get(
  //   "https://picsum.photos/v2/list?page=2&limit=10"
  // );
  // console.log(response.data);

  res.render("discover",{user:req.user})
} catch (error) {
  res.send(error)
}
});


// -------------ISloggedIn Function-------------

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

module.exports = router;
