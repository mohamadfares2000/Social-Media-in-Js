const Url = 'https://tarmeezacademy.com/api/v1'
let currentPage = 1
let lastPage = 1

getPosts()
setupUI()

document.getElementById("post").innerHTML=''

function getPosts(page = 1){
    toggleLodaer(true)
    axios.get(`${Url}/posts?limit=2&page=${page}`)
        .then(function (response) {
        toggleLodaer(false)
        var allPosts = response.data.data;
        lastPage = response.data.meta.last_page
        for(var post of allPosts ){
            var PostTitle = "";
            var tags = post.tags;
            var commint_count= post.comments_count;
            if(post.title!=null){
                PostTitle=post.title
            }  
            let user = getCurrentUser()
            let isMyPost = user != null && post.author.id == user.id
            let editButtonContent=``
            let DeleteButtonContent=``
            if(isMyPost){
                editButtonContent = `<button style='cursor: pointer;' id="edit" onclick='editPost("${encodeURIComponent(JSON.stringify(post))}")'>Edit</button>`
                DeleteButtonContent = `<button style='cursor: pointer;' id="edit" onclick='DeletePost("${post.id}")'>Delete</button>`
            }

            let content = `
            <div class="card shadow mb-4" id="single-post" >
                <div class="card-header" style="display: flex; justify-content: space-between;">
                <div onclick='userClicked(${post.author.id})' style='cursor:pointer'>
                  <img src="${post.image}" style="width: 40px; height: 40px;" class="rounded-circle" alt="" >
                  <b>@${post.author.username}</b>
                </div>
                    <div>
                        ${DeleteButtonContent}
                        ${editButtonContent}
                    </div>
              </div>
                <div class="card-body " onclick='postCliced(${post.id})' style='cursor: pointer;'>
                    <img src="${post.image}" style="width: 100%; " alt="" srcset="">
                    <h6 class="mt-1" style="color: gray;">${post.created_at}</h6>
                    <h5>${PostTitle}</h5>
                    <p>${post.body}</p>
                    <hr>
                <div style="display: flex; align-items: center;" id='newTag-${post.id}'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>
                    <span>
                        (${commint_count}) Commints
                </div>
            </div>
            </div>
            ` 

            document.getElementById("post").innerHTML+=content
            const currentPostsId = `newTag-${post.id}`
            
            for(var tag of tags){  
                let tagStyle =`
                <div style="color: white; background-color: gray; border-radius: 30px; margin-left: 20px; padding: 10px;">
                ${tag.arabic_name}
                </div>
                `
                document.getElementById(currentPostsId).innerHTML+=tagStyle
            }
        }  
    })
}

window.addEventListener("scroll", function(){
        const documentHeight = document.documentElement.scrollHeight;  
        const scrollPosition = window.innerHeight + window.pageYOffset;
        if (scrollPosition >= documentHeight && currentPage<lastPage) {
          currentPage=currentPage+1;
          getPosts(currentPage);         
        }
});

function LoginBtnClicked(){
    const username = document.getElementById("userName-input").value;
    const password = document.getElementById("password-input").value;
    
    const params = {
        "username": username , 
        "password": password
    }

    axios.post(`${Url}/login`,params)
    .then( (response)=>{

        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        localStorage.setItem("ProfileName",response.data.user.username)


        const modal = document.getElementById('exampleModal')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide();
            setupUI() 
            showAlert("loged in successfully",'success')
    })
    .catch((error)=>{
        showAlert(error.response.data.message,"danger")
    })
}

function RegisterBtnClicked(){
    const username = document.getElementById("userNameRegister-input").value;
    const password = document.getElementById("passwordRegister-input").value;
    const name = document.getElementById("NameRegister-input").value;
    const image = document.getElementById('profile-img-input').files[0]

    let formData = new FormData();
    formData.append('username',username)
    formData.append('password',password)
    formData.append('name',name)
    formData.append('image',image)

    const  headers = {
        "Content-Type" : 'multipart/form-data',
    }

    axios.post(`${Url}/register`,formData,{
        headers: headers
    })
    .then( (response)=>{
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        localStorage.setItem("ProfileName",response.data.user.username)

        const modal = document.getElementById('exampleRegisterModal')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide();
        setupUI() 
        showAlert("New user Register successfully",'success')
    }).catch((error)=>{
        showAlert(error.response.data.message,'danger')
    })
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("ProfileName")
    setupUI()
    showAlert("loged out ",'success')
}

function showAlert(massage,method) {
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
    
      alertPlaceholder.append(wrapper)
    }
        appendAlert(massage , method)

        setTimeout(function() {
            bootstrap.Alert.getOrCreateInstance(document.querySelector(".alert")).close();
        }, 3000)

}

    function setupUI() {
        const token = localStorage.getItem("token")
        const loginBtn = document.getElementById('login-btn')
        const RegisterBtn = document.getElementById('register-btn')
        const logoutBtn = document.getElementById('logout-btn')
        const acountName = document.getElementById('account-name')
        const addPost = document.getElementById('add-post')
        const ProfileImg = document.getElementById('profile-img')
        const myObjStrFromStorage = localStorage.getItem("user");
    
    if(token == null) {
        loginBtn.style.visibility = "visible";
        RegisterBtn.style.visibility = "visible";
        logoutBtn.style.display = "none";
        acountName.style.display = "none";
        addPost.style.display = "none"
        ProfileImg.style.display = "none"
    }else {
        loginBtn.style.visibility = "hidden";
        RegisterBtn.style.visibility = "hidden";
        logoutBtn.style.display = "flex";
        acountName.style.display = "flex";
        addPost.style.display = "flex"
        ProfileImg.style.display = "flex"
        const myObjFromStorage = JSON.parse(myObjStrFromStorage);
        document.getElementById('profile-img').src = myObjFromStorage.profile_image
        document.getElementById('account-name').innerHTML = localStorage.getItem('ProfileName');
    }
}

function postCliced(id){
    window.location=`postDetals.html?id=${id}`
}

function CreatNewPostClicked() {
    
    let postId = document.getElementById('post-id-input').value
    let isCreate = postId == null || postId == "";

    const title = document.getElementById("TitlePost-input").value;
    const body = document.getElementById("post-body-input").value;
    const image = document.getElementById('post-img-input').files[0]
    const token = localStorage.getItem("token")
    let fullUrl = ``;

    let formData = new FormData();
    formData.append('body',body)
    formData.append('title',title)
    formData.append('image',image)
    
    const  headers = {
        "Content-Type" : 'multipart/form-data',
        "Authorization" : `Bearer ${token}`
    }

    if(isCreate){
        fullUrl = `${Url}/posts`
    }else {
        fullUrl = `${Url}/posts/${postId}`
        formData.append("_method","put")
    }
    
    axios.post(fullUrl,formData,{
        headers: headers
    })
    .then( ()=>{
        const modal = document.getElementById('CreatPostModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        showAlert("Posted  Successfuly" , 'success');
        location.reload();

    }).catch((error)=>{
        var erorrMassage = error.response.data.message
        showAlert(erorrMassage , 'danger')
    })

}

function getCurrentUser() {
    let user = null ;
    const storgeUser = localStorage.getItem("user");
    if(storgeUser != null) {
        user = JSON.parse(storgeUser)
    }
    return user ;
}

function editPost(post) { 
    let PostObj = JSON.parse(decodeURIComponent(post));
    document.getElementById('crear-modal-btn').innerHTML = 'Update'
    document.getElementsByClassName('edit-post')[0].innerHTML="Edit Post";
    document.getElementsByClassName('post-body-input1')[0].value = PostObj.body
    document.getElementById('TitlePost-input').value=PostObj.title;
    document.getElementById('post-id-input').value = PostObj.id

    let postModal = new bootstrap.Modal(document.getElementById('CreatPostModal'),{})
    postModal.toggle();
}


function addBtnClicked() {
    document.getElementById('crear-modal-btn').innerHTML = 'Create'
    document.getElementsByClassName('edit-post')[0].innerHTML="Create a New Post";
    document.getElementsByClassName('post-body-input1')[0].value = ""
    document.getElementById('TitlePost-input').value="";
    document.getElementById('post-id-input').value = ""

    let postModal = new bootstrap.Modal(document.getElementById('CreatPostModal'),{})
    postModal.toggle();

}

function DeletePost(id){
    let token = localStorage.getItem("token")    
    let fullUrl = `${Url}/posts/${id}`;
    const  headers = {
        "Authorization" : `Bearer ${token}`
    }
    axios.delete(fullUrl,{
        headers: headers
    })
    .then( ()=>{
        getPosts()
        showAlert("Deletd  Successfuly" , 'success');

    }).catch((error)=>{
        var erorrMassage = error.message
        showAlert(erorrMassage , 'danger')
    })
}

function userClicked(id){
    window.location= `profile.html?userid=${id}`
}

function profileclicked(){
    let userId =getCurrentUser()
    window.location= `profile.html?userid=${userId.id}`
}

function toggleLodaer(show=true) {
    if(show){
        document.getElementById('lodaer').style.visibility='visibility';
    }
    else{
        document.getElementById('lodaer').style.visibility='hidden';
    }
}