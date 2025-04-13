const base_url = 'https://real-time-chat-application-mq1s.onrender.com'
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-form');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const identifier = document.getElementById('identifier').value.trim();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        progressBar.style.display = 'block';
        
        // Simulate progress
        let width = 0;
        const progressInterval = setInterval(() => {
            if (width >= 100) {
                clearInterval(progressInterval);
            } else {
                width++;
                progress.style.width = width + '%';
            }
        }, 20);

        try {
            // Actual POST request to backend
            const response = await fetch(`${base_url}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailOrusername: identifier })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to send reset link');
            }

            // Show success message
            showMessage(result.message || 'Reset link has been sent to your email!', 'success');

            // Reset form
            form.reset();
        } catch (error) {
            showMessage(error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            // Reset button and progress bar
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
            progressBar.style.display = 'none';
            progress.style.width = '0%';
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});
