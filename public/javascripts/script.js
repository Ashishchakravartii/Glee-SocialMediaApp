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


// ===========================================================
// Get all elements with the class "likeButton"
// const likeButtons = document.querySelectorAll(".likeButton");

// // Function to update the like status and button appearance
// function updateLikeStatus(likeButton, isLiked) {
//   const likeStatus = likeButton.nextElementSibling; // Get the next element (like status)
//   likeStatus.innerText = `${isLiked ? 1 : 0} Like${isLiked ? "" : "s"}`;
//   likeButton.innerText = isLiked ? "Unlike" : "Like";
//   likeButton.style.backgroundColor = isLiked ? "#e74c3c" : "#3498db";
// }

// // Function to handle the "Like" button click
// function handleLikeButtonClick(event) {
//   const likeButton = event.target; // Get the clicked button
//   const postId = likeButton.parentElement.getAttribute("data-post-id");

//   // Simulate the API request to like/unlike the post
//   fetch(`/likePost/${postId}`, { method: "POST" })
//     .then((response) => {
//       if (response.status === 200) {
//         return response.json();
//       } else if (response.status === 404) {
//         throw new Error("Post not found");
//       } else {
//         throw new Error("Failed to like/unlike the post");
//       }
//     })
//     .then((data) => {
//       updateLikeStatus(likeButton, data.isLiked);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// // Attach the click event handler to each "Like" button
// likeButtons.forEach((button) => {
//   button.addEventListener("click", handleLikeButtonClick);
// });

// // Fetch the initial like status for each post when the page loads
// likeButtons.forEach((button) => {
//   const postId = button.parentElement.getAttribute("data-post-id");
//   fetch(`/getLikeStatus/${postId}`, { method: "GET" })
//     .then((response) => {
//       if (response.status === 200) {
//         return response.json();
//       } else {
//         throw new Error("Failed to fetch like status");
//       }
//     })
//     .then((data) => {
//       updateLikeStatus(button, data.isLiked);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });


// like

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




