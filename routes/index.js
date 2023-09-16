var express = require('express');
var router = express.Router();
const passport= require("passport")
const LocalStrategy= require("passport-local")
const UserModel= require("../models/usermodel")
passport.use(new LocalStrategy(UserModel.authenticate()));

const {sendmail}= require("../utils/mail")

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

router.get("/signup",(req,res,next)=>{
  res.render("signup")
})
router.post("/signup",async(req,res,next)=>{
 try {
   const { username, email, password } = req.body;
   await UserModel.register({ username, email }, password);
   res.redirect("/signin");
 } catch (error) {
  res.send(error.message);
 }
 
})


// -----------signIn---------------

router.get("/signin",(req,res,next)=>{
  res.render("signin")
})
router.post(
  "/signin",
 passport.authenticate("local",{
  successRedirect:"/home",
  failureRedirect:"/signin"
 }),
  (req, res, next) => {}
);

// -------------Home page =================

router.get("/home",(req,res)=>{
  res.render("homepage")
})
// ----------- SignOut--------------------

router.get("/signout",(req,res,next)=>{
  req.logOut(()=>{
    res.redirect("/signin")
  })
})

// ----------- Reset --------------------

router.get("/reset",(req,res,next)=>{
  res.render("reset",{user:req.user})
  console.log(req.user)
})

router.post("/reset/:id",async(req,res,next)=>{
try {
   const user= await UserModel.findById(req.params.id)
   await user.changePassword(req.body.oldpassword, req.body.newpassword);
   res.redirect("/signin")
} catch (error) {
  console.log(error)
}
})

// ----------------- Get mail page ---------------

router.get("/getEmail",(req,res,next)=>{
  res.render("getemail")
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

router.get("/change-password/:id",async(req,res,next)=>{
try {
  const user = await UserModel.findById(req.params.id);
   res.render("change-Password",{user})
} catch (error) {
  res.send(error)
}
})
router.post("/change-password/:id",async(req,res,next)=>{
   try {
    const user = await UserModel.findById(req.params.id);
    await user.setPassword(req.body.password);
    await user.save();
    res.redirect("/signin");
   } catch (error) {
    res.send(error)
   }  
});

// -------------ISloggedIn Function-------------

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/signin")
}

module.exports = router;
