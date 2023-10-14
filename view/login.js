let eyeicon = document.getElementById("eyeicon");
let password = document.getElementById("password");

eyeicon.onclick = () => {
    if(password.type === "password") {
        password.type = "text";
        eyeicon.src = "/css/eye-open.png"
    } else {
        password.type = "password";
        eyeicon.src="/css/eye-close.png"
    }
}

async function logInUser(event) {
    event.preventDefault()
    const email = event.target.email.value;
    const password = event.target.password.value;
    const user = {
        email, password
    }
    await axios.post("http://107.23.210.145:4500/user/login", user)
        .then(response => {
            if(response.data.success){
                alert(response.data.message)
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('userId', response.data.userId)
                window.location.href="./expense.html"
            }else{
                alert(response.data.message)
            }
            
        })
        .catch(err => console.log(err))
}