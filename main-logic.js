const Url = 'https://tarmeezacademy.com/api/v1'

function setupUI() {
    const token = localStorage.getItem("token")
    const loginBtn = document.getElementById('login-btn')
    const RegisterBtn = document.getElementById('register-btn')
    const logoutBtn = document.getElementById('logout-btn')
    const acountName = document.getElementById('account-name')
    const ProfileImg = document.getElementById('profile-img')
    const myObjStrFromStorage = localStorage.getItem("user");
    
    if(token == null) {
        loginBtn.style.visibility = "visible";
        RegisterBtn.style.visibility = "visible";
        logoutBtn.style.display = "none";
        acountName.style.display = "none";
        ProfileImg.style.display = "none"
    }else {
        loginBtn.style.visibility = "hidden";
        RegisterBtn.style.visibility = "hidden";
        logoutBtn.style.display = "flex";
        acountName.style.display = "flex";
        ProfileImg.style.display = "flex"
        const myObjFromStorage = JSON.parse(myObjStrFromStorage);
        document.getElementById('profile-img').src = myObjFromStorage.profile_image
    }
    document.getElementById('account-name').innerHTML = localStorage.getItem('ProfileName');
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
            showAlert("loged in successfully",'success')
            setupUI() 
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
