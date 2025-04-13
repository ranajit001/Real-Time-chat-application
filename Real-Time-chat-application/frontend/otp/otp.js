
import base_url from "../baseurl.js";

document.addEventListener('DOMContentLoaded', () => {
    // Get email from localStorage
    const userEmail = JSON.parse(localStorage.getItem('email'));
    if (userEmail) {
        document.getElementById('userEmail').textContent = userEmail;
    }
    const otpForm = document.getElementById('otp-form');
    const inputs = document.querySelectorAll('.otp-digit');
    const resendButton = document.getElementById('resendOTP');
    const messageDiv = document.getElementById('message');
    const timerSpan = document.getElementById('timer');
    
    // Auto focus and move to next input
    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key >= 0 && e.key <= 9) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else if (e.key === 'Backspace') {
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            }
        });
    });

    // Handle form submission
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const otp = Array.from(inputs).map(input => input.value).join('');
        // console.log(otp)
        try {
            const response = await fetch(`${base_url}/verify/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({otp,email:userEmail})
            });
            const data = await response.json();
            
            if (response.ok) {
                showMessage('OTP verified successfully!', 'success');
                
                //storing the data in local storage
                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                  );
                  localStorage.removeItem('email'); //removing the email which was stored in sign up page 
                // Redirect to chat section
                setTimeout(() => {
                    window.location.href = '../chat/chat.html';
                }, 1500);
            } else {
                console.log(data);
                console.log(userEmail)
                showMessage(data.message || 'Invalid OTP', 'error');
            }
        } catch (error) {
            console.log(error);
            
            showMessage('Error verifying OTP', 'error');
        }
    });




    // Resend OTP functionality
    let timeLeft = 30;
    let timerId = null;

    function updateTimer() {
        if (timeLeft > 0) {
            timerSpan.textContent = ` (${timeLeft}s)`;
            timeLeft--;
        } else {
            clearInterval(timerId);
            timerSpan.textContent = '';
            resendButton.style.pointerEvents = 'auto';
            resendButton.style.opacity = '1';
        }
    }

    function startTimer() {
        timeLeft = 30;
        resendButton.style.pointerEvents = 'none';
        resendButton.style.opacity = '0.5';
        updateTimer();
        timerId = setInterval(updateTimer, 1000);
    }

    // Start initial timer
    startTimer();

    // Handle resend OTP
    resendButton.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${base_url}/verify/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: localStorage.getItem('email') })
            });

            const data = await response.json();
            
            if (response.ok) {
                showMessage('OTP resent successfully!', 'success');
                startTimer();
            } else {
                showMessage(data.message || 'Error resending OTP', 'error');
            }
        } catch (error) {
            showMessage('Error resending OTP', 'error');
        }
    });

    //show message in the bellow field
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
});