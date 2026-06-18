const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    localStorage.setItem("isAdminLoggedIn", "true");
    window.location.href = "index.html";
  } else {
    loginMessage.textContent = "Invalid username or password.";
  }
});