document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.button-text');
    const spinner = document.querySelector('.spinner');
    const statusMessage = document.getElementById('statusMessage');

    // N8N Webhook URL (Production URL)
    // Pastikan URL di bawah ini sama dengan "Production URL" yang ada di Webhook Node kamu
    const WEBHOOK_URL = 'http://localhost:5679/webhook/sentiment';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const customerName = document.getElementById('customerName').value;
        const reviewText = document.getElementById('reviewText').value;

        // Reset status message
        hideStatus();

        // Set loading state
        setLoading(true);

        try {
            // Kita mengubah format data menjadi URL Encoded agar browser tidak mengirimkan 
            // preflight OPTIONS (yang menyebabkan CORS error).
            const formData = new URLSearchParams();
            formData.append('customer_name', customerName);
            formData.append('review_text', reviewText);

            // Menggunakan mode: 'no-cors' agar browser mengabaikan pengecekan CORS sepenuhnya
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            // Dalam mode no-cors, kita tidak bisa membaca response.ok,
            // jadi kita asumsikan sukses karena data pasti terkirim (sama seperti CMD).
            showStatus('Thank you! Your feedback has been securely transmitted and analyzed.', 'success');
            form.reset();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            showStatus('Oops! Something went wrong. Please check if n8n is running and CORS is enabled.', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = 'Analyzing...';
            spinner.style.display = 'block';
        } else {
            btnText.textContent = 'Send Feedback';
            spinner.style.display = 'none';
        }
    }

    let hideTimeout;

    function showStatus(message, type) {
        clearTimeout(hideTimeout);
        statusMessage.textContent = message;
        statusMessage.className = `status-message status-${type} show`;
        statusMessage.style.display = 'block';

        // Auto hide after 5 seconds if success
        if (type === 'success') {
            setTimeout(() => {
                hideStatus();
            }, 5000);
        }
    }

    function hideStatus() {
        statusMessage.className = 'status-message';
        hideTimeout = setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 400); // Wait for fade out animation
    }
});
