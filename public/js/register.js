document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const messageBox = document.getElementById('messageBox');

  registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (!username || !email || !password) {
      messageBox.textContent = 'All fields are required.';
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        messageBox.textContent = data.error || 'Registration failed.';
        return;
      }

      localStorage.setItem('vulnweb.username', data.username || username);
      messageBox.textContent = data.message || 'Registration successful.';
      setTimeout(() => {
        window.location.href = './index.html';
      }, 1000);
    } catch (error) {
      messageBox.textContent = 'Unable to register at this time.';
    }
  });
});
