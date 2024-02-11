setupUi()
getUser()
getposts()
function getCurrentUserid(){
  const urlPrams=new URLSearchParams(window.location.search)
  const id= urlPrams.get("userid")
  return id
}
function getUser(){
  const id=getCurrentUserid()
  axios.get(`${shorturl}/users/${id}`)
  .then((response) => {
const user=response.data.data
/*    <div class="user-main-info" id="main-info-email">ssdsds@gfg</div>
      <div class="user-main-info" id="main-info-name">ssdsds</div>
      <div class="user-main-info" id="main-info-username">ssdsds111</div>
                    <div class="number-info" id="post-count"><span> 13 </span>posts</div>
                  <div class="number-info" id="comments-count"><span> 20 </span>comments</div>
                   */
document.getElementById("main-info-email").innerHTML=user.email //from api
document.getElementById("main-info-name").innerHTML=user.name //from api
document.getElementById("main-info-username").innerHTML=user.username //from api
document.getElementById("post-count").innerHTML=user.posts_count
document.getElementById("comments-count").innerHTML=user.comments_count
///  <img  id="main-info-img" src="./assets/avatar.jpg" style="width: 120px; border-radius: 200px !important " alt="" />
document.getElementById("main-info-img").src=user.profile_image
//    <h1> <span id="name-posts"></span>posts</h1>
document.getElementById("name-posts").innerHTML=user.username

})}
function getposts() {
  const id=getCurrentUserid()
  axios.get(`${shorturl}/users/${id}/posts`)
  .then((response) => {
    const posts = response.data.data;
    //          <div class="row" id="user-posts">
document.getElementById("user-posts").innerHTML="" 


    for (post of posts) {
      const author = post.author;
      let postTitle=""
      ///show or hide edit button
      let user=getCurrentUser()
      let isMypost= user !=null && post.author.id==user.id
let editbuttonContent=``
if(isMypost){
///delet button
///edit button
  editbuttonContent=`
  <button class="btn btn-danger" style="float:right ; margin-left:5px" onclick="deletePostbtnClick('${encodeURIComponent(JSON.stringify(post))}')">delete</button>

  <button class="btn btn-secondary" style="float:right" onclick="editPostbtnClick('${encodeURIComponent(JSON.stringify(post))}')">edit</button>

  `
}   
 if(post.title!=null){
        postTitle=post.title
      }
      let content = `
 <div class="card shadow">
 <div class="card-header">
   <img
     src="${author.profile_image}"
     alt=""
     style="width: 50px; height: 40px"
     class="rounded-circle border border-1"
   />
   <b>${author.username}</b>
${editbuttonContent}
 </div>
 <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
   <img src="${post.image}" alt="" style="width: 100%" />
   <h6>${post.created_at}</h6>
   <h5>${post.title}</h5>
   <p>
    ${post.body}
   </p>
   <hr />
   <div>
     <svg
       xmlns="http://www.w3.org/2000/svg"
       width="16"
       height="16"
       fill="currentColor"
       class="bi bi-pen"
       viewBox="0 0 16 16"
     >
       <path
         d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
       />
     </svg>
     <span>${post.comments_count}</span>
     <span id="post-tags-${post.id}">
     
     </span>
   </div>
 </div>
</div>
 `;
      document.getElementById("user-posts").innerHTML += content;
      //  <span id="post-tags"><button class="btn btn-sm rounded-5" style="background-color:gray; color:white">Policy</button></span>
      const currentPosttagsId = `post-tags-${post.id}`;
      document.getElementById(currentPosttagsId).innerHTML = "";
      for (tag of post.tags) {
        let Tagscontent = `
<button class="btn btn-sm rounded-5" style="background-color:gray; color:white">${tag.name}</button>

`;
        document.getElementById(currentPosttagsId).innerHTML += Tagscontent;
      }
    }
  });
}


