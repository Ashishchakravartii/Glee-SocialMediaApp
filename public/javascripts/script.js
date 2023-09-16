const createPostBtn = document.querySelector(".createPost")
const uploadDiv = document.querySelector(".uploadDiv");
const feedContainer = document.querySelector(".feedContainer");
const closeUpload = document.querySelector(".closeUpload");

createPostBtn.addEventListener("click",()=>{
    uploadDiv.style.right="1%";
})
closeUpload.addEventListener("click", () => {
  uploadDiv.style.right = "-30%";
});