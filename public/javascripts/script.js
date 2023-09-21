const createPostBtn = document.querySelector(".createPost")
const uploadDiv = document.querySelector(".uploadDiv");
const feedContainer = document.querySelector(".feedContainer");
const closeUpload = document.querySelector(".closeUpload");
const moreOptionPost = document.querySelector(".moreOptionPost");
const postOptionDiv = document.querySelector(".postOptionDiv");
const postOptionDivCancelBtn = document.querySelector(".postOptionDiv-cancel-btn");
const PostViewWindow = document.querySelector(".PostViewWindow");

createPostBtn.addEventListener("click",()=>{
  uploadDiv.style.right = "3%";
  
})
closeUpload.addEventListener("click", () => {
  uploadDiv.style.right = "-30%";
});

moreOptionPost.addEventListener("click",()=>{
  postOptionDiv.style.display="initial"
  // PostViewWindow.style.filter = "blur(5px)";
  PostViewWindow.style.filter = "brightness(0.4)";
})
postOptionDivCancelBtn.addEventListener("click", () => {
  postOptionDiv.style.display = "none";
  PostViewWindow.style.filter = "brightness(1)";
  // PostViewWindow.style.filter = "blur(0px)";
});