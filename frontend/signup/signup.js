import { base_url } from "../baseurl.js";

document.getElementById("signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();
const Useremail = document.getElementById("email").value.trim();
    // Get form data
    const userData = {
        name: document.getElementById("fullName").value.trim(),
        email: Useremail,
        password: document.getElementById("password").value,
        username: document.getElementById("username").value,
    };

   
    // Password match validation
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (userData.password !== confirmPassword) {
        showMessage("Passwords do not match", "error");
        return;
    }

    try {
        const response = await fetch(`${base_url}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
            console.log('resr',response,'data',data)
        if (response.ok) {

            localStorage.setItem('email',   JSON.stringify(Useremail)) // storing the email in local storage
            //which will be removed when user verified by otp in otp page

            showMessage("Signup successful! Redirecting...", "success");
            setTimeout(() => {
                window.location.href = "../otp/otp.html";
            }, 1500);
        } else {
            showMessage(data.message || "Signup failed", "error");
        }
    } catch (error) {
        console.log(error);
        
        showMessage(error, "error");
    }
});

function showMessage(text, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

