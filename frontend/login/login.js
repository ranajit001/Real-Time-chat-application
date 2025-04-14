import { base_url } from "../baseurl.js";

document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const usernameOrEmail = document.getElementById("usernameOrEmail").value.trim();
    const password = document.getElementById("password").value;

    // Prepare login data
    const loginData = { usernameOrEmail, password };

    try {
      const response = await fetch(
        `${ base_url }/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();
 
      if (response.ok && data.token) {
        // Save both token and user data
        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );

        showMessage("Login successful! Redirecting...", "success");
        window.location.href = "../chat/chat.html";
      } else {
        showMessage("Login failed", "error");
      }
    } catch (error) {
      showMessage("Error connecting to server", "error");
      console.log(error);
      
    }
  });

function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}
