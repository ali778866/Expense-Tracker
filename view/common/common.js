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
    await axios.post("http://localhost:4500/user/login", user)
        .then(response => {
            alert(response.data.message)
            // console.log("user::::", response.data.userId)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('userId', response.data.userId)
            window.location.href="./expense.html"
        })
        .catch(err => console.log(err))
}

function saveUser(event) {
    event.preventDefault()
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const user = {
        name, email, password
    }
    axios.post("http://localhost:4500/user/signup", user)
        .then(response => {
            alert(response.data.message)
            window.location.href="./login.html"
        })
        .catch(err => console.log(err))
}