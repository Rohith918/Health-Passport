function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const message = document.getElementById("message");
  
    if (pass.length >= 8) {
      message.style.color = "lightgreen";
      message.textContent = "Login successful! ";
      
      setTimeout(() => {
        window.location.href = "Index_new_1.html";
      }, 1000); 
    }
    else{
        message.style.color = "salmon";
        message.textContent = "Invalid username or password";
    }
  }
  