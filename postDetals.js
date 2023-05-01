const Url = 'https://tarmeezacademy.com/api/v1'
const UrlParams = new URLSearchParams(window.location.search)
const PostId = UrlParams.get('id') ; 
const token = localStorage.getItem("token")

getPost()
setupUI()

function addComment() {
        var commentBody=document.getElementById('comment-body').value;

        var params = {
            "body":  commentBody,
        }

        axios.post(`${Url}/posts/${PostId}/comments`,params,{
            headers:{
                "Authorization" : `Bearer ${token}`
            }
        })

        .then( (response)=>{
            document.getElementById('comment-body').value='';
            getPost()
            showAlert("commented successfully" , 'success' )
        }).catch((error)=>{
            var erorrMassage = error.response.data.message
            showAlert(erorrMassage , 'danger')
        })   
    
}

function getPost(){
    axios.get(`${Url}/posts/${PostId}`)
        .then(function (response) {
            var post = response.data.data;
            var commint_count= response.data.data.comments_count;
            var PostTitle = "";
            var comments = post.comments;
            let commentsContent = ``
            var tags = post.tags;
            document.getElementById('OwnerPost').innerHTML=post.author.username
            if(post.title!=null){
                    PostTitle=post.title
                        for(comment of comments){
                            commentsContent+=`
                            <div class="p-3" style="background-color: rgb(177, 175, 175);">
                            <div>
                            <img src="${comment.author.profile_image}" class="rounded-circle" alt="" style="width: 40px; height: 40px;">
                            <b>${comment.author.username}</b>
                            </div>
                            <div>
                            ${comment.body}
                            </div>
                        </div>
                            `
                        }  
                    let content = `
                    <div class="card shadow mb-4" id="single-post" >
                        <div class="card-header">
                            <img src="${post.image}" style="width: 40px; height: 40px;" class="rounded-circle" alt="" >
                            <b>@${post.author.username}</b>
                        </div>
                        <div class="card-body" '>
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
                    <div id='comments'>
                    ${commentsContent}
                    </div>

                <div id="add-comment" >
                    <input type="text" class=" mt-2 mb-2 col-11" id="comment-body">
                    <button id="comment-btn"  class="" style="color: rgb(107, 107, 241); border-color: rgb(107, 107, 241);" onclick="addComment()">send</button>
                </div>

                    ` 
                document.getElementById("post").innerHTML=""
                document.getElementById("post").innerHTML=content
                const currentPostsId = `newTag-${post.id}`

                for(var tag of tags){  
                    let tagStyle =`
                    <div style="color: white; background-color: gray; border-radius: 30px; margin-left: 20px; padding: 10px;">
                    ${tag.arabic_name}
                    </div>
                    `
                    document.getElementById(currentPostsId).innerHTML+=tagStyle
                }
            setupUI()
        }  
    })
}

function setupUI() {
    const token = localStorage.getItem("token")
    const loginBtn = document.getElementById('login-btn')
    const RegisterBtn = document.getElementById('register-btn')
    const logoutBtn = document.getElementById('logout-btn')
    const acountName = document.getElementById('account-name')
    const ProfileImg = document.getElementById('profile-img')
    const myObjStrFromStorage = localStorage.getItem("user");
    const addComment = document.getElementById('add-comment')
    
    if(token == null) {
        loginBtn.style.visibility = "visible";
        RegisterBtn.style.visibility = "visible";
        logoutBtn.style.display = "none";
        acountName.style.display = "none";
        ProfileImg.style.display = "none"
        addComment.style.display = "none"
    }else {
        loginBtn.style.visibility = "hidden";
        RegisterBtn.style.visibility = "hidden";
        logoutBtn.style.display = "flex";
        acountName.style.display = "flex";
        ProfileImg.style.display = "flex"
        addComment.style.display = "block"
        const myObjFromStorage = JSON.parse(myObjStrFromStorage);
        document.getElementById('profile-img').src = myObjFromStorage.profile_image
        document.getElementById('account-name').innerHTML = localStorage.getItem('ProfileName');
    }
}

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
            getPost()
            showAlert("loged in successfully",'success')

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
        showAlert("New user Register successfully",'success')
        setupUI() 
    }).catch((error)=>{
        showAlert(error.response.data.message,'danger')
    })
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("ProfileName")
    setupUI()
    getPost()
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

function getCurrentUser() {
    let user = null ;
    const storgeUser = localStorage.getItem("user");
    if(storgeUser != null) {
        user = JSON.parse(storgeUser)
    }
    return user ;
}

function profileclicked(){
    let userId =getCurrentUser()
    window.location= `profile.html?userid=${userId.id}`
}