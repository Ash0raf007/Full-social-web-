let currentpage = 1;
let lastpg = 1;
window.addEventListener("scroll", function () {
  /// Infinite Scroll posts
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage && currentpage < lastpg) {
    currentpage = currentpage + 1;
    getposts(false, currentpage);
  }
});

setupUi();

getposts();

//js  <div onclick="userClicked()">

function userClicked(userId){
window.location=`profile.html?userid=${userId}`

}

function getposts(reload = true, page = 1) {
  toggleLoader(true)  // show loading

  axios.get(`${shorturl}/posts?limit=2&page=${page}`)
  .then((response) => {
    toggleLoader(false)  // hidding loading 
    const posts = response.data.data;
    lastpg = response.data.meta.last_page; // let lastpg=1  // api response.data.meta.last_page
    if (reload) {
      document.getElementById("posts").innerHTML = "";
    }

    for (post of posts) {
      console.log(post);
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
 <div class="card-header" >
 
 <span onclick="userClicked(${author.id})" style="cursor:pointer">
 <img src="${author.profile_image}" alt="" style="width: 50px; height: 40px" class="rounded-circle border border-1"/>
<b>${author.username}</b> 
</span>

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
      document.getElementById("posts").innerHTML += content;
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

//////////login page

// html         <button type="button" class="btn btn-primary" onclick="loginbtnclick()">Login</button>
//  html   <input type="text" class="form-control" id="username-input">

///  html  <input type="password" class="form-control" id="password-input">





/////////////لاخفاء صفحة تسجيل الدخول بعد حفظ البيانات
//   html  <div class="modal fade"         id="login-modal"         tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//            <button type="button" class="btn btn-outline-success mx-2"   data-bs-toggle="modal" data-bs-target=     "#login-modal"   >

const logi = document.getElementById("login-modal");
const loglii = bootstrap.Modal.getInstance(logi);
loglii.hide(); /// to hide form
showAlert("Login succefuly", "success"); /// estd3aa delet alert
setupUi();

/*
<button onclick="logout()" id="logout-btn" type="button" class="btn btn-outline-danger mx-2"   data-bs-toggle="modal" data-bs-target="#login-modal">
logout
</button>
*/

////////////////////////////////////////////////////////////////////
function creatPostModal() {
  ///            <input type="text" class="form-control" id="post-title-input">
  ///            <textarea name="" id="post-body-input" style="width:100%; height: 200px; border-color: gray; border-radius: 10px; resize: none;"></textarea>
  //            <input type="file" class="form-control" id="post-image-input">
//               <input type="hidden" id="post-id-input" value="">
let postId=document.getElementById("post-id-input").value
let isCreate=postId==null||postId==""   ///true or false

const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0]; ///بمعنى اختيار عنصر واحد فقط [0]
  const token = localStorage.getItem("token"); 

  let formData = new FormData(); ///// "body","title" from api but body,title el fard   const title,  const body  يمكن تغيير الفرض ولايمكن تغيير البيانات " " لانهم اسمهم كده فى ايه بى اى
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  let url = ``;
  const headers = {
    "Content-Type": "multipart/form-data", 
    authorization: `Bearer ${token}`,
  };
  if(isCreate){
     url = `${shorturl}/posts`;
     axios.post(url, formData, {
    
      headers: headers, 
    })

    .then((response) => {
      const logi = document.getElementById("creat-post-modal");
      const loglii = bootstrap.Modal.getInstance(logi);
      loglii.hide();
      showAlert("posted succesfuly", "success");
      getposts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger"); /// danger color red warnning
    });

  }else{
    formData.append("_method","put")   /////edit post
    url = `${shorturl}/posts/${postId}`;
    axios.post(url, formData, {
      ///حفظ صم
      headers: headers, 
    })

    .then((response) => {
      const logi = document.getElementById("creat-post-modal");
      const loglii = bootstrap.Modal.getInstance(logi); 
      loglii.hide();
      showAlert("posted succesfuly", "success");
      getposts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger"); /// danger color red warnning
    });
    


  }

}
/////////////
function postClicked(postId){
window.location=`postDetails.html?postId=${postId}` //////الانتقال لصفحه اخرى
}



//<div class="bg-primary" id="add-btn" onclick="addbtnclicked()">+</div>

function addbtnclicked(){


//        <button type="button" id="post-model-submit" class="btn btn-primary" onclick="creatPostModal()">Creat</button>
document.getElementById("post-model-submit").innerHTML="Creat"
//                        <input type="hidden" id="post-id-input" value="">

document.getElementById("post-id-input").value=""
  //  html      <h1 class="modal-title fs-5" id="post-modal-title">Creat A New Post</h1>
document.getElementById("post-modal-title").innerHTML="Creat new post"
//   html         <input type="text" class="form-control" id="post-title-input">

document.getElementById("post-title-input").value=""
document.getElementById("post-body-input").value=""

  //   html   <div class="modal fade"    id="creat-post-modal"    tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
let postModal=new bootstrap.Modal(document.getElementById("creat-post-modal"),{})
postModal.toggle() //3ard elnamozag
}



