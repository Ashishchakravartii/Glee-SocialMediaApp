const createPostBtn = document.querySelector(".createPost");
const uploadDiv = document.querySelector(".uploadDiv");
const feedContainer = document.querySelector(".feedContainer");
const closeUpload = document.querySelector(".closeUpload");
const moreOptionPost = document.querySelector(".moreOptionPost");
const postOptionDiv = document.querySelector(".postOptionDiv");
const postOptionDivCancelBtn = document.querySelector(
  ".postOptionDiv-cancel-btn"
);
const PostViewWindow = document.querySelector(".PostViewWindow");

createPostBtn.addEventListener("click", () => {
  uploadDiv.style.right = "3%";
});
closeUpload.addEventListener("click", () => {
  uploadDiv.style.right = "-30%";
});

moreOptionPost.addEventListener("click", () => {
  postOptionDiv.style.display = "initial";
  // PostViewWindow.style.filter = "blur(5px)";
  PostViewWindow.style.filter = "brightness(0.4)";
});
postOptionDivCancelBtn.addEventListener("click", () => {
  postOptionDiv.style.display = "none";
  PostViewWindow.style.filter = "brightness(1)";
  // PostViewWindow.style.filter = "blur(0px)";
});


// Select all likeTags
const likeTags = document.querySelectorAll(".likeTag");

// Add an event listener to each likeTag
likeTags.forEach((likeTag) => {
  likeTag.addEventListener("click", () => {
    toggleLike(likeTag);
  });
});

function toggleLike(likeTag) {
  const likeIcon = likeTag.querySelector("#likeIcon");

  // Toggle the class of the heart icon to change its appearance
  if (likeIcon.classList.contains("ri-heart-3-line")) {
    likeIcon.classList.remove("ri-heart-3-line");
    likeIcon.classList.add("ri-heart-3-fill");
  } else {
    likeIcon.classList.remove("ri-heart-3-fill");
    likeIcon.classList.add("ri-heart-3-line");
  }
}


// ===============================================


let flag = 0;
document.querySelector("#like-heart").addEventListener("click", () => {
  if (flag === 0) {
    document.querySelector(".ri-heart-3-line").style.color = "red";
    flag = 1;
  } else if (flag === 1) {
    document.querySelector(".ri-heart-3-line").style.color = "white";
    flag = 0;
  }
}); 




