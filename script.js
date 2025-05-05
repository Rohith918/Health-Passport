function isStrongPassword(pwd) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(pwd);
  }


function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const message = document.getElementById("message");
  
    if (isStrongPassword(pass)) {
      message.style.color = "lightgreen";
      message.textContent = "Login successful! ";
      
      setTimeout(() => {
        window.location.href = "index2.html";
      }, 1000); 
    }
    else{
        message.style.color = "salmon";
        message.textContent = "Invalid username or password";
    }
  }
