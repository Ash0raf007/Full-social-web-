const shorturl = "https://tarmeezacademy.com/api/v1";


// post requests
/// js    <button class="btn btn-secondary" style="float:right" onclick="editPostbtnClick()">edit</button>
///edit post
function editPostbtnClick(postObject)
{
let post=JSON.parse(decodeURIComponent(postObject))

//        <button type="button" id="post-model-submit" class="btn btn-primary" onclick="creatPostModal()">Creat</button>
document.getElementById("post-model-submit").innerHTML="update"
//                        <input type="hidden" id="post-id-input" value="">

document.getElementById("post-id-input").value=post.id
  //  html      <h1 class="modal-title fs-5" id="post-modal-title">Creat A New Post</h1>
document.getElementById("post-modal-title").innerHTML="Edit post"
//   html         <input type="text" class="form-control" id="post-title-input">

document.getElementById("post-title-input").value=post.title
document.getElementById("post-body-input").value=post.body

  //   html   <div class="modal fade"    id="creat-post-modal"    tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
let postModal=new bootstrap.Modal(document.getElementById("creat-post-modal"),{})
postModal.toggle() //3ard elnamozag
}


/// delete post
  function deletePostbtnClick(postObject)
{
let post=JSON.parse(decodeURIComponent(postObject))
///<input type="text" id="delete-post-id-input" value="">
document.getElementById("delete-post-id-input").value=post.id

//<div class="modal fade" id="delete-post-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
let postModal=new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
postModal.toggle() //3ard elnamozag
}

///comfirm delete
//        <button type="button" id="post-model-submit" class="btn btn-primary" onclick="comfirmepostdelete()">Delete</button>
function comfirmepostdelete(){
  const token = localStorage.getItem("token");

  //        <input type="text" id="delete-post-id-input" value="">
const postId=document.getElementById("delete-post-id-input").value  
const url = `${shorturl}/posts/${postId}`;
const headers = {
  "Content-Type": "multipart/form-data", 
  authorization: `Bearer ${token}`, 
};

  axios.delete(url,{
    headers: headers 
  
  })    ////amr hazf el dala api

  .then((response) => { 
    ///seve token user in localstorage
      const logi = document.getElementById("delete-post-modal");
      const loglii = bootstrap.Modal.getInstance(logi); 
      loglii.hide();
      showAlert("posted has been deleted Successfuly", "success");
      getposts();
  }).catch((error)=>{  ///3end hdos moskila
  const message = error.response.data.message;
  showAlert(message, "danger"); /// danger color red warnning
});             

}

///                    <a class="nav-link" onclick="profileClicked()">Profile</a>
function profileClicked(){
  const user= getCurrentUser()
  const userId=user.id
  window.location=`profile.html?userid=${userId}`
}


function setupUi() {
  ///////////// show or hide
  const gettoken = localStorage.getItem("token");
  /* html
                  <div class="d-flex w-100 justify-content-end" id="logout-div">
                  <div class="d-flex w-100 justify-content-end" id="login-div">
  
  
  */
  const loginbtn = document.getElementById("login-div");
  const logoutbtn = document.getElementById("logout-div");

  // htm <div class="bg-primary" id="add-btn" btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#creat-post-modal">+</div>

  const addbtn = document.getElementById("add-btn");

  if (gettoken == null) {
    if (addbtn!=null){
      addbtn.style.setProperty("display", "none", "important"); ////hide button

    }
    /// user gust
    loginbtn.style.setProperty("display", "flex", "important"); ////// بمعنى اضهارهم لتسجيل الدخول
    logoutbtn.style.setProperty("display", "none", "important");
  } else {
    if (addbtn!=null){
      addbtn.style.setProperty("display", "block", "important"); ///show button
    }

    /// for loged in user
    loginbtn.style.setProperty("display", "none", "important"); ////// بمعنى اخفاءهم عند تسجيل الدخول
    logoutbtn.style.setProperty("display", "flex", "important"); ////واظهار زرار لوج اوت
    //    html              <b id="nav-username">@dddd</b>   //// show user id
    const user = getCurrentUser();
    document.getElementById(
      "nav-username"
    ).innerHTML = `  <b id="nav-username">${user.username}</b>`;
    ///    html  <img  id="nav-userimage" class="rounded-circle " style="width: 40px; height: 40px;" src="./assets/avatar.jpg" alt="">
    document.getElementById("nav-userimage").src = user.profile_image; // show image user
  }
}

function loginbtnclick() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  const prams = {
    username: username,
    password: password,
  };

  const url = `${shorturl}/login`;
  toggleLoader(true)
  axios.post(url, prams)
  .then((response) => {
    ///seve token user in localstorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    /////////////لاخفاء صفحة تسجيل الدخول بعد حفظ البيانات
    //   html  <div class="modal fade"         id="login-modal"         tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    //            <button type="button" class="btn btn-outline-success mx-2"   data-bs-toggle="modal" data-bs-target=     "#login-modal"   >

    const logi = document.getElementById("login-modal");
    const loglii = bootstrap.Modal.getInstance(logi); /// كود ثابت حفظ
    loglii.hide(); /// to hide form
    showAlert("Login succefuly", "success"); /// estd3aa delet alert
    setupUi();
  }).catch((error)=>{   ////when wrong accour
  const message=error.response.data.message
  showAlert(message,"danger")
  
    }).finally(()=>{
      toggleLoader(false)

    })
}

///////////////////

function registerbtnclick() {
  //            <input type="text" class="form-control" id="register-name-input">
  //            <input type="text" class="form-control" id="register-username-input">
  //            <input type="password" class="form-control" id="register-password-input">
  //            <input type="file" class="form-control" id="register-image-input">

  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const image = document.getElementById("register-image-input").files[0]; ///بمعنى اختيار عنصر واحد فقط [0]

  let formData = new FormData(); ///// "name","username" ,"password", "image" from api but name,username ,password,image el fard   const name,const username  يمكن تغيير الفرض ولايمكن تغيير البيانات " " لانهم اسمهم كده فى ايه بى اى
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const url = `${shorturl}/register`;
  toggleLoader(true) /// show loading before response
  
  axios.post(url, formData, {
  
      headers: headers,  
    })

    .then((response) => {
      ///seve token user in localstorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      /////////////لاخفاء صفحة التسجيل  بعد حفظ البيانات
      //   html  <div class="modal fade"         id="login-modal"         tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      //            <button type="button" class="btn btn-outline-success mx-2"   data-bs-toggle="modal" data-bs-target=     "#login-modal"   >

      const logi = document.getElementById("register-modal");
      const loglii = bootstrap.Modal.getInstance(logi);
      loglii.hide(); /// to hide form
      showAlert("ٌNew Register succefuly", "success"); ///// estd3aa delet alert
      setupUi();
    })
    .catch((error) => {
      ///////fe halet edkhal byanat mawgoda men kabl
      const message = error.response.data.message;
      showAlert(message, "danger"); /// danger color red warnning
    }).finally(()=>{
      toggleLoader(false)

    })
}



/////////////////toggle loder loading
//    <div  id="loader" style=" background: rgba(128, 128, 128, 0.377);  position: fixed;top:0px;bottom:0px; left: 0px;right: 0px; margin: auto auto; justify-content: center ;display:flex; align-items: center; z-index: 99999; width: 100px ; height: 50px; border-radius: 20px;">
function toggleLoader(show=true)
{
  if(show)
  {
document.getElementById("loader").style.visibility='visible'
  }else{
    document.getElementById("loader").style.visibility='hidden'

  }

}


////////////////
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logout succesfuly", "success");
  setupUi();
}

//////////
///////////// show alert
function showAlert(customeMessage, type) {
  ///  html <div id="succes-alert"></div>

  ////// from bootstrap decumentaion
  const alertPlaceholder = document.getElementById("succes-alert");
  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type}  alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  alert(customeMessage, type);
  /// hide alert
  setTimeout(() => {
    const hidealert = bootstrap.Alert.getOrCreateInstance("#succes-alert");
    //todo  hidealert.close()
  }, 2000);
}

///////////////////
function getCurrentUser() {
  //// we use it to get user id information
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

